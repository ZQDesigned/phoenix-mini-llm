from __future__ import annotations

from pathlib import Path

import torch
from torch.utils.data import DataLoader, TensorDataset

from phoenix_mini_llm.config import ModelConfig, TrainingConfig
from phoenix_mini_llm.models.transformer import PhoenixMiniLM
from phoenix_mini_llm.training.loop import evaluate_batches, fit, run_train_step
from phoenix_mini_llm.training.optim import build_optimizer, build_scheduler


def build_model() -> PhoenixMiniLM:
    config = ModelConfig(
        hidden_size=32,
        num_layers=2,
        num_heads=4,
        intermediate_size=128,
        max_seq_len=16,
        dropout=0.0,
        rope_theta=10_000.0,
        rms_norm_eps=1e-5,
        vocab_size=64,
        pad_token_id=0,
        bos_token_id=1,
        eos_token_id=2,
    )
    return PhoenixMiniLM(config)


def build_training_config() -> TrainingConfig:
    return TrainingConfig(
        seed=7,
        batch_size=2,
        gradient_accumulation_steps=1,
        learning_rate=3e-4,
        weight_decay=0.1,
        adam_beta1=0.9,
        adam_beta2=0.95,
        warmup_steps=0,
        max_steps=10,
        eval_interval=2,
        save_interval=2,
        log_interval=1,
        gradient_clip_norm=1.0,
        num_workers=0,
        amp=False,
    )


def test_run_train_step_returns_finite_loss_and_updates_parameters() -> None:
    torch.manual_seed(0)
    model = build_model()
    optimizer = build_optimizer(model, build_training_config())
    before = model.token_embeddings.weight.detach().clone()
    batch = (
        torch.randint(0, 64, (2, 8)),
        torch.randint(0, 64, (2, 8)),
    )

    metrics = run_train_step(
        model=model,
        batch=batch,
        optimizer=optimizer,
        device=torch.device("cpu"),
        gradient_clip_norm=1.0,
        amp_enabled=False,
    )

    assert torch.isfinite(torch.tensor(metrics.loss))
    assert metrics.grad_norm >= 0.0
    assert not torch.equal(model.token_embeddings.weight, before)


def test_evaluate_batches_returns_average_loss() -> None:
    torch.manual_seed(0)
    model = build_model()
    inputs = torch.randint(0, 64, (4, 8))
    targets = torch.randint(0, 64, (4, 8))
    loader = DataLoader(TensorDataset(inputs, targets), batch_size=2)

    loss = evaluate_batches(
        model=model,
        dataloader=loader,
        device=torch.device("cpu"),
        max_batches=2,
    )

    assert loss > 0.0


def test_fit_runs_requested_steps_and_writes_checkpoint(tmp_path: Path) -> None:
    torch.manual_seed(0)
    model = build_model()
    training_config = build_training_config()
    optimizer = build_optimizer(model, training_config)
    scheduler = build_scheduler(optimizer, training_config)
    inputs = torch.randint(0, 64, (8, 8))
    targets = torch.randint(0, 64, (8, 8))
    train_loader = DataLoader(TensorDataset(inputs, targets), batch_size=2, shuffle=False)
    val_loader = DataLoader(TensorDataset(inputs, targets), batch_size=2, shuffle=False)

    summary = fit(
        model=model,
        train_dataloader=train_loader,
        val_dataloader=val_loader,
        optimizer=optimizer,
        scheduler=scheduler,
        training_config=training_config,
        device=torch.device("cpu"),
        checkpoint_dir=tmp_path,
    )

    assert summary.step == training_config.max_steps
    assert summary.best_eval_loss > 0.0
    assert (tmp_path / "step-000010.pt").exists()


def test_fit_can_resume_from_existing_step(tmp_path: Path) -> None:
    torch.manual_seed(0)
    model = build_model()
    training_config = build_training_config()
    optimizer = build_optimizer(model, training_config)
    scheduler = build_scheduler(optimizer, training_config)
    inputs = torch.randint(0, 64, (8, 8))
    targets = torch.randint(0, 64, (8, 8))
    train_loader = DataLoader(TensorDataset(inputs, targets), batch_size=2, shuffle=False)
    val_loader = DataLoader(TensorDataset(inputs, targets), batch_size=2, shuffle=False)

    summary = fit(
        model=model,
        train_dataloader=train_loader,
        val_dataloader=val_loader,
        optimizer=optimizer,
        scheduler=scheduler,
        training_config=training_config,
        device=torch.device("cpu"),
        checkpoint_dir=tmp_path,
        start_step=8,
    )

    assert summary.step == training_config.max_steps


def test_fit_returns_immediately_when_resume_is_already_complete(tmp_path: Path) -> None:
    model = build_model()
    training_config = build_training_config()
    optimizer = build_optimizer(model, training_config)
    scheduler = build_scheduler(optimizer, training_config)
    inputs = torch.randint(0, 64, (8, 8))
    targets = torch.randint(0, 64, (8, 8))
    train_loader = DataLoader(TensorDataset(inputs, targets), batch_size=2, shuffle=False)
    val_loader = DataLoader(TensorDataset(inputs, targets), batch_size=2, shuffle=False)

    summary = fit(
        model=model,
        train_dataloader=train_loader,
        val_dataloader=val_loader,
        optimizer=optimizer,
        scheduler=scheduler,
        training_config=training_config,
        device=torch.device("cpu"),
        checkpoint_dir=tmp_path,
        start_step=training_config.max_steps,
    )

    assert summary.step == training_config.max_steps
