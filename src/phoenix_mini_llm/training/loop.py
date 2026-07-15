from __future__ import annotations

from collections.abc import Iterable, Iterator
from contextlib import nullcontext
from dataclasses import dataclass
from os import PathLike
from pathlib import Path

import torch
from torch import nn
from torch.optim import Optimizer
from torch.optim.lr_scheduler import LRScheduler

from phoenix_mini_llm.config import TrainingConfig
from phoenix_mini_llm.training.checkpoints import save_checkpoint


@dataclass(slots=True)
class TrainStepMetrics:
    loss: float
    grad_norm: float


@dataclass(slots=True)
class TrainSummary:
    step: int
    last_train_loss: float
    best_eval_loss: float


def run_train_step(
    *,
    model: nn.Module,
    batch: tuple[torch.Tensor, torch.Tensor],
    optimizer: Optimizer,
    device: torch.device,
    gradient_clip_norm: float,
    amp_enabled: bool,
) -> TrainStepMetrics:
    model.train()
    optimizer.zero_grad(set_to_none=True)
    input_ids, targets = (tensor.to(device) for tensor in batch)
    autocast_context = (
        torch.autocast(device_type="cuda", dtype=torch.float16)
        if amp_enabled and device.type == "cuda"
        else nullcontext()
    )
    with autocast_context:
        output = model(input_ids=input_ids, targets=targets)
        if output.loss is None:
            raise RuntimeError("model output loss must not be None during training")
        loss = output.loss
    loss.backward()
    grad_norm = float(torch.nn.utils.clip_grad_norm_(model.parameters(), gradient_clip_norm))
    optimizer.step()
    return TrainStepMetrics(loss=float(loss.detach().cpu().item()), grad_norm=grad_norm)


def fit(
    *,
    model: nn.Module,
    train_dataloader: Iterable[tuple[torch.Tensor, torch.Tensor]],
    val_dataloader: Iterable[tuple[torch.Tensor, torch.Tensor]],
    optimizer: Optimizer,
    scheduler: LRScheduler | None,
    training_config: TrainingConfig,
    device: torch.device,
    checkpoint_dir: str | PathLike[str],
    start_step: int = 0,
) -> TrainSummary:
    model.to(device)
    scaler = torch.amp.GradScaler(
        device.type,
        enabled=training_config.amp and device.type == "cuda",
    )
    train_iterator = _infinite_batches(train_dataloader)
    best_eval_loss = float("inf")
    last_train_loss = 0.0

    for step in range(start_step + 1, training_config.max_steps + 1):
        model.train()
        optimizer.zero_grad(set_to_none=True)
        accumulated_loss = 0.0

        for _ in range(training_config.gradient_accumulation_steps):
            input_ids, targets = (tensor.to(device) for tensor in next(train_iterator))
            autocast_context = (
                torch.autocast(device_type="cuda", dtype=torch.float16)
                if training_config.amp and device.type == "cuda"
                else nullcontext()
            )
            with autocast_context:
                output = model(input_ids=input_ids, targets=targets)
                if output.loss is None:
                    raise RuntimeError("model output loss must not be None during training")
                loss = output.loss / training_config.gradient_accumulation_steps

            accumulated_loss += float(output.loss.detach().cpu().item())
            scaler.scale(loss).backward()

        scaler.unscale_(optimizer)
        torch.nn.utils.clip_grad_norm_(model.parameters(), training_config.gradient_clip_norm)
        scaler.step(optimizer)
        scaler.update()
        if scheduler is not None:
            scheduler.step()

        last_train_loss = accumulated_loss / training_config.gradient_accumulation_steps

        should_evaluate = (
            step % training_config.eval_interval == 0
            or step == training_config.max_steps
        )
        eval_loss = best_eval_loss
        if should_evaluate:
            eval_loss = evaluate_batches(model=model, dataloader=val_dataloader, device=device)
            best_eval_loss = min(best_eval_loss, eval_loss)

        should_save = step % training_config.save_interval == 0 or step == training_config.max_steps
        if should_save:
            save_checkpoint(
                Path(checkpoint_dir) / f"step-{step:06d}.pt",
                model=model,
                optimizer=optimizer,
                scheduler=scheduler,
                step=step,
                metadata={"eval_loss": eval_loss},
            )

    return TrainSummary(
        step=training_config.max_steps,
        last_train_loss=last_train_loss,
        best_eval_loss=best_eval_loss,
    )


def evaluate_batches(
    *,
    model: nn.Module,
    dataloader: Iterable[tuple[torch.Tensor, torch.Tensor]],
    device: torch.device,
    max_batches: int | None = None,
) -> float:
    model.eval()
    total_loss = 0.0
    count = 0
    with torch.no_grad():
        for batch_index, batch in enumerate(dataloader):
            if max_batches is not None and batch_index >= max_batches:
                break
            input_ids, targets = (tensor.to(device) for tensor in batch)
            output = model(input_ids=input_ids, targets=targets)
            if output.loss is None:
                raise RuntimeError("model output loss must not be None during evaluation")
            total_loss += float(output.loss.detach().cpu().item())
            count += 1
    if count == 0:
        raise ValueError("evaluation received zero batches")
    return total_loss / count


def _infinite_batches(
    dataloader: Iterable[tuple[torch.Tensor, torch.Tensor]],
) -> Iterator[tuple[torch.Tensor, torch.Tensor]]:
    while True:
        yield from dataloader
