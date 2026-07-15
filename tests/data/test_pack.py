from __future__ import annotations

import numpy as np
import torch

from phoenix_mini_llm.data.dataset import PackedTokenDataset
from phoenix_mini_llm.data.normalize import normalize_story_text
from phoenix_mini_llm.data.pack import pack_token_sequences


def test_normalize_story_text_strips_and_normalizes_newlines() -> None:
    raw = "  Hello\r\nworld.  \r\n\r\n"

    normalized = normalize_story_text(raw)

    assert normalized == "Hello\nworld."


def test_pack_token_sequences_adds_boundaries_and_drops_incomplete_tail() -> None:
    sequences = [[4, 5], [6]]

    packed = pack_token_sequences(
        sequences=sequences,
        sequence_length=3,
        bos_token_id=1,
        eos_token_id=2,
    )

    assert packed.shape == (1, 4)
    assert packed.tolist() == [[1, 4, 5, 2]]


def test_packed_token_dataset_returns_shifted_inputs_and_targets() -> None:
    packed = np.array([[1, 4, 5, 2]], dtype=np.int64)
    dataset = PackedTokenDataset(packed)

    input_ids, targets = dataset[0]

    assert isinstance(input_ids, torch.Tensor)
    assert isinstance(targets, torch.Tensor)
    assert input_ids.tolist() == [1, 4, 5]
    assert targets.tolist() == [4, 5, 2]
