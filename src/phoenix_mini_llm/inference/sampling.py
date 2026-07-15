from __future__ import annotations

import torch


def sample_next_token(
    *,
    logits: torch.Tensor,
    temperature: float,
    top_k: int,
    top_p: float,
) -> torch.Tensor:
    if temperature <= 0:
        raise ValueError("temperature must be positive")

    scaled_logits = logits / temperature

    if top_k > 0:
        top_values, _ = torch.topk(scaled_logits, k=min(top_k, scaled_logits.size(-1)), dim=-1)
        cutoff = top_values[..., -1, None]
        scaled_logits = scaled_logits.masked_fill(scaled_logits < cutoff, float("-inf"))

    if 0.0 < top_p < 1.0:
        sorted_logits, sorted_indices = torch.sort(scaled_logits, descending=True, dim=-1)
        sorted_probs = torch.softmax(sorted_logits, dim=-1)
        cumulative = torch.cumsum(sorted_probs, dim=-1)
        remove_mask = cumulative > top_p
        remove_mask[..., 0] = False
        sorted_logits = sorted_logits.masked_fill(remove_mask, float("-inf"))
        scaled_logits = torch.full_like(scaled_logits, float("-inf"))
        scaled_logits.scatter_(dim=-1, index=sorted_indices, src=sorted_logits)

    probabilities = torch.softmax(scaled_logits, dim=-1)
    return torch.multinomial(probabilities, num_samples=1).squeeze(-1)
