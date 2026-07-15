from __future__ import annotations

import argparse

import torch

from phoenix_mini_llm.cli.common import (
    apply_prepare_metadata,
    load_prepare_metadata,
    resolve_checkpoint_path,
    tokenizer_path,
)
from phoenix_mini_llm.config import load_run_config
from phoenix_mini_llm.data.tokenizer import load_tokenizer
from phoenix_mini_llm.inference.generate import generate_tokens
from phoenix_mini_llm.models.transformer import PhoenixMiniLM
from phoenix_mini_llm.training.checkpoints import load_checkpoint
from phoenix_mini_llm.training.optim import build_optimizer, build_scheduler
from phoenix_mini_llm.utils.device import detect_device
from phoenix_mini_llm.utils.logging import configure_logging


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Generate text with phoenix-mini-llm.")
    parser.add_argument(
        "--config",
        default="configs/debug.toml",
        help="Path to a TOML config file.",
    )
    parser.add_argument("--checkpoint", default="latest", help="Checkpoint path or 'latest'.")
    parser.add_argument("--prompt", default="", help="Prompt text.")
    parser.add_argument(
        "--max-new-tokens",
        type=int,
        default=None,
        help="Override generation length.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    logger = configure_logging()
    config = load_run_config(args.config)
    prepare_metadata = load_prepare_metadata(config)
    apply_prepare_metadata(config, prepare_metadata)
    device = detect_device()

    tokenizer = load_tokenizer(tokenizer_path(config))
    model = PhoenixMiniLM(config.model).to(device)
    optimizer = build_optimizer(model, config.training)
    scheduler = build_scheduler(optimizer, config.training)
    checkpoint_path = resolve_checkpoint_path(config, args.checkpoint)
    load_checkpoint(
        checkpoint_path,
        model=model,
        optimizer=optimizer,
        scheduler=scheduler,
        device=device,
    )

    encoded_prompt = tokenizer.encode(args.prompt).ids if args.prompt else []
    prompt_tokens = [config.model.bos_token_id, *encoded_prompt]
    prompt_tensor = torch.tensor([prompt_tokens], dtype=torch.long, device=device)
    generated = generate_tokens(
        model=model,
        prompt_ids=prompt_tensor,
        max_new_tokens=args.max_new_tokens or config.generation.max_new_tokens,
        temperature=config.generation.temperature,
        top_k=config.generation.top_k,
        top_p=config.generation.top_p,
        eos_token_id=config.model.eos_token_id,
    )
    text = tokenizer.decode(generated[0].tolist(), skip_special_tokens=True)
    logger.info("Generated from checkpoint %s", checkpoint_path)
    print(text)
