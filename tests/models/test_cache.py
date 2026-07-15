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


def test_kv_cache_grows_for_incremental_generation() -> None:
    torch.manual_seed(0)
    model = PhoenixMiniLM(build_model_config())
    model.eval()

    first_output = model(input_ids=torch.tensor([[1, 2, 3]]), use_cache=True)
    second_output = model(
        input_ids=torch.tensor([[4]]),
        use_cache=True,
        past_key_values=first_output.past_key_values,
    )

    assert first_output.past_key_values is not None
    assert second_output.past_key_values is not None
    assert first_output.past_key_values[0][0].shape[-2] == 3
    assert second_output.past_key_values[0][0].shape[-2] == 4
    assert second_output.logits.shape == (1, 1, 64)
