from __future__ import annotations

import torch

from phoenix_mini_llm.inference.sampling import sample_next_token


def test_sample_next_token_respects_top_k() -> None:
    logits = torch.tensor([[1.0, 9.0, 7.0]])

    token = sample_next_token(logits=logits, temperature=1.0, top_k=1, top_p=1.0)

    assert token.item() == 1


def test_sample_next_token_respects_top_p_cutoff() -> None:
    logits = torch.tensor([[8.0, 1.0, 0.5]])

    token = sample_next_token(logits=logits, temperature=1.0, top_k=0, top_p=0.5)

    assert token.item() == 0
