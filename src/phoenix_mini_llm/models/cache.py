from __future__ import annotations

from typing import TypeAlias

import torch

PastKeyValue: TypeAlias = tuple[torch.Tensor, torch.Tensor]
PastKeyValues: TypeAlias = list[PastKeyValue]
