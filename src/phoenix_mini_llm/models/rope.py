from __future__ import annotations

import torch


def build_rope_cache(
    sequence_length: int,
    head_dim: int,
    device: torch.device,
    theta: float,
) -> tuple[torch.Tensor, torch.Tensor]:
    if head_dim % 2 != 0:
        raise ValueError("head_dim must be even for rotary embeddings")

    positions = torch.arange(sequence_length, device=device, dtype=torch.float32)
    frequencies = 1.0 / (
        theta ** (torch.arange(0, head_dim, 2, device=device, dtype=torch.float32) / head_dim)
    )
    angles = torch.outer(positions, frequencies)
    cos = torch.cos(angles)
    sin = torch.sin(angles)
    return cos, sin


def apply_rope(
    tensor: torch.Tensor,
    cos: torch.Tensor,
    sin: torch.Tensor,
    offset: int = 0,
) -> torch.Tensor:
    query_length = tensor.shape[-2]
    cos = cos[offset : offset + query_length].unsqueeze(0).unsqueeze(0)
    sin = sin[offset : offset + query_length].unsqueeze(0).unsqueeze(0)

    left = tensor[..., ::2]
    right = tensor[..., 1::2]
    rotated = torch.stack(
        (
            left * cos - right * sin,
            left * sin + right * cos,
        ),
        dim=-1,
    )
    return rotated.flatten(start_dim=-2)
