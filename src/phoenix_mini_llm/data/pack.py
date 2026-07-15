from __future__ import annotations

import numpy as np


def pack_token_sequences(
    sequences: list[list[int]],
    sequence_length: int,
    bos_token_id: int,
    eos_token_id: int,
) -> np.ndarray:
    flattened: list[int] = []
    for sequence in sequences:
        flattened.extend([bos_token_id, *sequence, eos_token_id])

    chunk_size = sequence_length + 1
    usable_tokens = len(flattened) // chunk_size * chunk_size
    if usable_tokens == 0:
        return np.zeros((0, chunk_size), dtype=np.int64)

    array = np.array(flattened[:usable_tokens], dtype=np.int64)
    return array.reshape(-1, chunk_size)
