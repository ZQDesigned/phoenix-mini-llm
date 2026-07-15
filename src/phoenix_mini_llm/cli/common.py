from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from phoenix_mini_llm.config import RunConfig


def metadata_path(config: RunConfig) -> Path:
    return config.paths.artifacts_dir / "prepare_metadata.json"


def tokenizer_path(config: RunConfig) -> Path:
    return config.paths.artifacts_dir / "tokenizer" / "tokenizer.json"


def train_data_path(config: RunConfig) -> Path:
    return config.paths.data_dir / "train.npy"


def validation_data_path(config: RunConfig) -> Path:
    return config.paths.data_dir / "validation.npy"


def load_prepare_metadata(config: RunConfig) -> dict[str, Any]:
    return json.loads(metadata_path(config).read_text())


def apply_prepare_metadata(config: RunConfig, metadata: dict[str, Any]) -> None:
    config.model.vocab_size = int(metadata["vocab_size"])
    config.model.pad_token_id = int(metadata["special_token_ids"]["pad"])
    config.model.bos_token_id = int(metadata["special_token_ids"]["bos"])
    config.model.eos_token_id = int(metadata["special_token_ids"]["eos"])
    config.model.unk_token_id = int(metadata["special_token_ids"]["unk"])


def resolve_checkpoint_path(config: RunConfig, checkpoint: str) -> Path:
    if checkpoint != "latest":
        return Path(checkpoint)

    checkpoint_root = config.paths.checkpoints_dir / config.run_name
    candidates = sorted(checkpoint_root.glob("step-*.pt"))
    if not candidates:
        raise FileNotFoundError(f"no checkpoints found in {checkpoint_root}")
    return candidates[-1]
