from __future__ import annotations

import torch

from phoenix_mini_llm.config import ModelConfig
from phoenix_mini_llm.inference.generate import generate_tokens
from phoenix_mini_llm.models.transformer import PhoenixMiniLM


def build_model() -> PhoenixMiniLM:
    config = ModelConfig(
        hidden_size=32,
        num_layers=2,
        num_heads=4,
        intermediate_size=128,
        max_seq_len=16,
        dropout=0.0,
        rope_theta=10_000.0,
        rms_norm_eps=1e-5,
        vocab_size=64,
        pad_token_id=0,
        bos_token_id=1,
        eos_token_id=2,
    )
    return PhoenixMiniLM(config)


def test_generate_tokens_extends_prompt_deterministically() -> None:
    torch.manual_seed(0)
    model = build_model()
    prompt = torch.tensor([[1, 2, 3]])

    generated = generate_tokens(
        model=model,
        prompt_ids=prompt,
        max_new_tokens=4,
        temperature=1.0,
        top_k=1,
        top_p=1.0,
    )

    assert generated.shape == (1, 7)
    assert generated[:, :3].tolist() == [[1, 2, 3]]
