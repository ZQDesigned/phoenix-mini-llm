from __future__ import annotations

import torch
from torch import nn

from phoenix_mini_llm.inference.sampling import sample_next_token


@torch.no_grad()
def generate_tokens(
    *,
    model: nn.Module,
    prompt_ids: torch.Tensor,
    max_new_tokens: int,
    temperature: float,
    top_k: int,
    top_p: float,
    eos_token_id: int | None = None,
) -> torch.Tensor:
    model.eval()
    device = next(model.parameters()).device
    generated = prompt_ids.to(device)
    past_key_values = None
    current_input = generated

    for _ in range(max_new_tokens):
        output = model(
            input_ids=current_input,
            use_cache=True,
            past_key_values=past_key_values,
        )
        next_token = sample_next_token(
            logits=output.logits[:, -1, :],
            temperature=temperature,
            top_k=top_k,
            top_p=top_p,
        )
        generated = torch.cat([generated, next_token.unsqueeze(-1)], dim=-1)
        past_key_values = output.past_key_values
        current_input = next_token.unsqueeze(-1)
        if eos_token_id is not None and torch.all(next_token == eos_token_id):
            break

    return generated.cpu()
