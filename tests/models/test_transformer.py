from __future__ import annotations

import torch

from phoenix_mini_llm.config import ModelConfig
from phoenix_mini_llm.models.transformer import PhoenixMiniLM


def build_model_config() -> ModelConfig:
    return ModelConfig(
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


def test_forward_returns_logits_and_loss() -> None:
    torch.manual_seed(0)
    model = PhoenixMiniLM(build_model_config())
    input_ids = torch.randint(0, 64, (2, 8))
    targets = torch.randint(0, 64, (2, 8))

    output = model(input_ids=input_ids, targets=targets)

    assert output.logits.shape == (2, 8, 64)
    assert output.loss is not None
    assert output.loss.ndim == 0


def test_forward_is_causal_for_prefix_positions() -> None:
    torch.manual_seed(0)
    model = PhoenixMiniLM(build_model_config())
    model.eval()
    prefix = torch.tensor([[1, 5, 9, 3, 7]])
    changed_suffix = torch.tensor([[1, 5, 9, 4, 2]])

    first = model(input_ids=prefix).logits
    second = model(input_ids=changed_suffix).logits

    torch.testing.assert_close(first[:, :3], second[:, :3])

