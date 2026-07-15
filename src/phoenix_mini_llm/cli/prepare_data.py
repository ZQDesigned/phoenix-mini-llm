from __future__ import annotations

import argparse
import json

from phoenix_mini_llm.cli.common import metadata_path
from phoenix_mini_llm.config import load_run_config
from phoenix_mini_llm.data.dataset import save_packed_tokens
from phoenix_mini_llm.data.download import download_tinystories_subset
from phoenix_mini_llm.data.normalize import normalize_story_batch
from phoenix_mini_llm.data.pack import pack_token_sequences
from phoenix_mini_llm.data.tokenizer import load_tokenizer, train_bpe_tokenizer
from phoenix_mini_llm.utils.logging import configure_logging


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Download and prepare TinyStories data.")
    parser.add_argument(
        "--config",
        default="configs/debug.toml",
        help="Path to a TOML config file.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    logger = configure_logging()
    config = load_run_config(args.config)
    config.paths.data_dir.mkdir(parents=True, exist_ok=True)
    config.paths.artifacts_dir.mkdir(parents=True, exist_ok=True)

    logger.info("Downloading TinyStories subset")
    train_texts = normalize_story_batch(download_tinystories_subset(config.dataset, "train"))
    validation_texts = normalize_story_batch(
        download_tinystories_subset(config.dataset, "validation")
    )

    logger.info("Training tokenizer on %s examples", len(train_texts))
    tokenizer_artifacts = train_bpe_tokenizer(
        texts=train_texts,
        config=config.tokenizer,
        output_dir=config.paths.artifacts_dir / "tokenizer",
    )
    tokenizer = load_tokenizer(tokenizer_artifacts.tokenizer_path)
    train_ids = [encoding.ids for encoding in tokenizer.encode_batch(train_texts)]
    validation_ids = [encoding.ids for encoding in tokenizer.encode_batch(validation_texts)]

    logger.info("Packing train and validation sequences")
    train_packed = pack_token_sequences(
        sequences=train_ids,
        sequence_length=config.model.max_seq_len,
        bos_token_id=tokenizer_artifacts.bos_token_id,
        eos_token_id=tokenizer_artifacts.eos_token_id,
    )
    validation_packed = pack_token_sequences(
        sequences=validation_ids,
        sequence_length=config.model.max_seq_len,
        bos_token_id=tokenizer_artifacts.bos_token_id,
        eos_token_id=tokenizer_artifacts.eos_token_id,
    )

    save_packed_tokens(config.paths.data_dir / "train.npy", train_packed)
    save_packed_tokens(config.paths.data_dir / "validation.npy", validation_packed)

    metadata = {
        "dataset_name": config.dataset.name,
        "train_examples": len(train_texts),
        "validation_examples": len(validation_texts),
        "train_sequences": int(train_packed.shape[0]),
        "validation_sequences": int(validation_packed.shape[0]),
        "vocab_size": tokenizer.get_vocab_size(),
        "special_token_ids": {
            "pad": tokenizer_artifacts.pad_token_id,
            "bos": tokenizer_artifacts.bos_token_id,
            "eos": tokenizer_artifacts.eos_token_id,
            "unk": tokenizer_artifacts.unk_token_id,
        },
    }
    metadata_path(config).write_text(json.dumps(metadata, indent=2))
    logger.info("Prepared dataset written to %s", config.paths.data_dir)
