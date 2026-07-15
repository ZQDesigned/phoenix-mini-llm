from __future__ import annotations

import argparse
import json

from torch.utils.data import DataLoader

from phoenix_mini_llm.cli.common import (
    apply_prepare_metadata,
    load_prepare_metadata,
    resolve_checkpoint_path,
    validation_data_path,
)
from phoenix_mini_llm.config import load_run_config
from phoenix_mini_llm.data.dataset import PackedTokenDataset
from phoenix_mini_llm.models.transformer import PhoenixMiniLM
from phoenix_mini_llm.training.checkpoints import load_checkpoint
from phoenix_mini_llm.training.loop import evaluate_batches
from phoenix_mini_llm.training.optim import build_optimizer, build_scheduler
from phoenix_mini_llm.utils.device import detect_device
from phoenix_mini_llm.utils.logging import configure_logging


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Evaluate phoenix-mini-llm.")
    parser.add_argument(
        "--config",
        default="configs/debug.toml",
        help="Path to a TOML config file.",
    )
    parser.add_argument("--checkpoint", default="latest", help="Checkpoint path or 'latest'.")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    logger = configure_logging()
    config = load_run_config(args.config)
    prepare_metadata = load_prepare_metadata(config)
    apply_prepare_metadata(config, prepare_metadata)
    device = detect_device()

    dataset = PackedTokenDataset.from_file(validation_data_path(config))
    dataloader = DataLoader(
        dataset,
        batch_size=config.training.batch_size,
        shuffle=False,
        num_workers=config.training.num_workers,
    )

    model = PhoenixMiniLM(config.model).to(device)
    optimizer = build_optimizer(model, config.training)
    scheduler = build_scheduler(optimizer, config.training)
    checkpoint_path = resolve_checkpoint_path(config, args.checkpoint)
    state = load_checkpoint(
        checkpoint_path,
        model=model,
        optimizer=optimizer,
        scheduler=scheduler,
        device=device,
    )
    loss = evaluate_batches(model=model, dataloader=dataloader, device=device)
    payload = {"checkpoint": str(checkpoint_path), "step": state.step, "validation_loss": loss}
    logger.info("Validation loss at step %s: %.4f", state.step, loss)
    print(json.dumps(payload, indent=2))
