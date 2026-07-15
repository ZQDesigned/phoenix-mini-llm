from __future__ import annotations

from pathlib import Path

import numpy as np
import torch
from torch.utils.data import Dataset


class PackedTokenDataset(Dataset[tuple[torch.Tensor, torch.Tensor]]):
    def __init__(self, packed_tokens: np.ndarray) -> None:
        if packed_tokens.ndim != 2:
            raise ValueError("packed_tokens must be a 2D array")
        self.packed_tokens = packed_tokens

    def __len__(self) -> int:
        return int(self.packed_tokens.shape[0])

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor]:
        row = self.packed_tokens[index]
        input_ids = torch.tensor(row[:-1], dtype=torch.long)
        targets = torch.tensor(row[1:], dtype=torch.long)
        return input_ids, targets

    @classmethod
    def from_file(cls, path: str | Path) -> PackedTokenDataset:
        return cls(np.load(path))


def save_packed_tokens(path: str | Path, packed_tokens: np.ndarray) -> None:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    np.save(output_path, packed_tokens)
