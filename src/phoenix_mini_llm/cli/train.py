from __future__ import annotations

import argparse
import json
from dataclasses import asdict

from torch.utils.data import DataLoader

from phoenix_mini_llm.cli.common import (
    apply_prepare_metadata,
    load_prepare_metadata,
    resolve_checkpoint_path,
    train_data_path,
    validation_data_path,
)
from phoenix_mini_llm.config import load_run_config
from phoenix_mini_llm.data.dataset import PackedTokenDataset
from phoenix_mini_llm.models.transformer import PhoenixMiniLM
from phoenix_mini_llm.training.checkpoints import load_checkpoint
from phoenix_mini_llm.training.loop import fit
from phoenix_mini_llm.training.optim import build_optimizer, build_scheduler
from phoenix_mini_llm.utils.device import detect_device
from phoenix_mini_llm.utils.logging import configure_logging
from phoenix_mini_llm.utils.randomness import set_seed


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Train phoenix-mini-llm.")
    parser.add_argument(
        "--config",
        default="configs/debug.toml",
        help="Path to a TOML config file.",
    )
    parser.add_argument("--resume", default=None, help="Checkpoint path or 'latest'.")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    logger = configure_logging()
    config = load_run_config(args.config)
    prepare_metadata = load_prepare_metadata(config)
    apply_prepare_metadata(config, prepare_metadata)

    device = detect_device()
    set_seed(config.training.seed)
    logger.info("Training on device=%s", device)

    train_dataset = PackedTokenDataset.from_file(train_data_path(config))
    validation_dataset = PackedTokenDataset.from_file(validation_data_path(config))
    train_loader = DataLoader(
        train_dataset,
        batch_size=config.training.batch_size,
        shuffle=True,
        num_workers=config.training.num_workers,
    )
    validation_loader = DataLoader(
        validation_dataset,
        batch_size=config.training.batch_size,
        shuffle=False,
        num_workers=config.training.num_workers,
    )

    model = PhoenixMiniLM(config.model).to(device)
    optimizer = build_optimizer(model, config.training)
    scheduler = build_scheduler(optimizer, config.training)
    start_step = 0

    if args.resume is not None:
        checkpoint_path = resolve_checkpoint_path(config, args.resume)
        state = load_checkpoint(
            checkpoint_path,
            model=model,
            optimizer=optimizer,
            scheduler=scheduler,
            device=device,
        )
        start_step = state.step
        logger.info("Resumed from %s at step %s", checkpoint_path, start_step)

    summary = fit(
        model=model,
        train_dataloader=train_loader,
        val_dataloader=validation_loader,
        optimizer=optimizer,
        scheduler=scheduler,
        training_config=config.training,
        device=device,
        checkpoint_dir=config.paths.checkpoints_dir / config.run_name,
        start_step=start_step,
    )

    summary_path = config.paths.runs_dir / config.run_name / "train_summary.json"
    summary_path.parent.mkdir(parents=True, exist_ok=True)
    summary_path.write_text(json.dumps(asdict(summary), indent=2))
    logger.info(
        "Training complete at step=%s best_eval_loss=%.4f",
        summary.step,
        summary.best_eval_loss,
    )
