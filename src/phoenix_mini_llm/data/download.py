from __future__ import annotations

from collections.abc import Iterable, Mapping
from typing import cast

from datasets import load_dataset

from phoenix_mini_llm.config import DatasetConfig


def collect_text_examples(
    records: Iterable[object],
    text_key: str,
    limit: int,
) -> list[str]:
    texts: list[str] = []
    for record in records:
        if not isinstance(record, Mapping):
            continue
        value = record.get(text_key)
        if isinstance(value, str):
            texts.append(value)
        if len(texts) >= limit:
            break
    return texts


def download_tinystories_subset(config: DatasetConfig, split: str) -> list[str]:
    dataset = load_dataset(config.name, split=split, streaming=config.streaming)
    limit = config.max_train_examples if split == "train" else config.max_validation_examples
    return collect_text_examples(
        cast(Iterable[object], dataset),
        text_key=config.text_key,
        limit=limit,
    )
