from __future__ import annotations

import math

import torch
from torch import nn

from phoenix_mini_llm.models.cache import PastKeyValue
from phoenix_mini_llm.models.rope import apply_rope, build_rope_cache


class RMSNorm(nn.Module):
    def __init__(self, hidden_size: int, eps: float) -> None:
        super().__init__()
        self.weight = nn.Parameter(torch.ones(hidden_size))
        self.eps = eps

    def forward(self, inputs: torch.Tensor) -> torch.Tensor:
        variance = inputs.pow(2).mean(dim=-1, keepdim=True)
        normalized = inputs * torch.rsqrt(variance + self.eps)
        return normalized * self.weight


class SwiGLUFeedForward(nn.Module):
    def __init__(self, hidden_size: int, intermediate_size: int, dropout: float) -> None:
        super().__init__()
        self.gate_proj = nn.Linear(hidden_size, intermediate_size, bias=False)
        self.value_proj = nn.Linear(hidden_size, intermediate_size, bias=False)
        self.out_proj = nn.Linear(intermediate_size, hidden_size, bias=False)
        self.dropout = nn.Dropout(dropout)

    def forward(self, inputs: torch.Tensor) -> torch.Tensor:
        gated = torch.nn.functional.silu(self.gate_proj(inputs)) * self.value_proj(inputs)
        return self.dropout(self.out_proj(gated))


class CausalSelfAttention(nn.Module):
    def __init__(
        self,
        hidden_size: int,
        num_heads: int,
        max_seq_len: int,
        rope_theta: float,
        dropout: float,
    ) -> None:
        super().__init__()
        self.hidden_size = hidden_size
        self.num_heads = num_heads
        self.max_seq_len = max_seq_len
        self.head_dim = hidden_size // num_heads
        self.rope_theta = rope_theta

        self.q_proj = nn.Linear(hidden_size, hidden_size, bias=False)
        self.k_proj = nn.Linear(hidden_size, hidden_size, bias=False)
        self.v_proj = nn.Linear(hidden_size, hidden_size, bias=False)
        self.out_proj = nn.Linear(hidden_size, hidden_size, bias=False)
        self.dropout = nn.Dropout(dropout)

    def forward(
        self,
        inputs: torch.Tensor,
        past_key_value: PastKeyValue | None = None,
        use_cache: bool = False,
    ) -> tuple[torch.Tensor, PastKeyValue | None]:
        batch_size, query_length, _ = inputs.shape
        past_length = 0 if past_key_value is None else past_key_value[0].shape[-2]
        total_length = past_length + query_length
        if total_length > self.max_seq_len:
            raise ValueError("sequence length exceeds configured max_seq_len")

        query = self._reshape(self.q_proj(inputs), batch_size, query_length)
        key = self._reshape(self.k_proj(inputs), batch_size, query_length)
        value = self._reshape(self.v_proj(inputs), batch_size, query_length)

        cos, sin = build_rope_cache(
            sequence_length=total_length,
            head_dim=self.head_dim,
            device=inputs.device,
            theta=self.rope_theta,
        )
        query = apply_rope(query, cos=cos, sin=sin, offset=past_length)
        key = apply_rope(key, cos=cos, sin=sin, offset=past_length)

        if past_key_value is not None:
            key = torch.cat([past_key_value[0], key], dim=-2)
            value = torch.cat([past_key_value[1], value], dim=-2)

        attention_scores = torch.matmul(query, key.transpose(-1, -2)) / math.sqrt(self.head_dim)
        attention_scores = attention_scores.masked_fill(
            self._causal_mask(
                query_length=query_length,
                key_length=key.shape[-2],
                past_length=past_length,
                device=inputs.device,
            ),
            torch.finfo(attention_scores.dtype).min,
        )
        attention_weights = torch.softmax(attention_scores, dim=-1, dtype=torch.float32).to(
            attention_scores.dtype
        )
        attention_output = torch.matmul(self.dropout(attention_weights), value)
        attention_output = attention_output.transpose(1, 2).contiguous().view(
            batch_size,
            query_length,
            self.hidden_size,
        )
        present = (key, value) if use_cache else None
        return self.out_proj(attention_output), present

    def _reshape(self, tensor: torch.Tensor, batch_size: int, sequence_length: int) -> torch.Tensor:
        return tensor.view(
            batch_size,
            sequence_length,
            self.num_heads,
            self.head_dim,
        ).transpose(1, 2)

    def _causal_mask(
        self,
        query_length: int,
        key_length: int,
        past_length: int,
        device: torch.device,
    ) -> torch.Tensor:
        query_positions = torch.arange(query_length, device=device).unsqueeze(-1)
        key_positions = torch.arange(key_length, device=device).unsqueeze(0)
        invalid = key_positions > (query_positions + past_length)
        return invalid.unsqueeze(0).unsqueeze(0)


class TransformerBlock(nn.Module):
    def __init__(
        self,
        hidden_size: int,
        num_heads: int,
        intermediate_size: int,
        max_seq_len: int,
        rope_theta: float,
        rms_norm_eps: float,
        dropout: float,
    ) -> None:
        super().__init__()
        self.attn_norm = RMSNorm(hidden_size, rms_norm_eps)
        self.ffn_norm = RMSNorm(hidden_size, rms_norm_eps)
        self.attention = CausalSelfAttention(
            hidden_size=hidden_size,
            num_heads=num_heads,
            max_seq_len=max_seq_len,
            rope_theta=rope_theta,
            dropout=dropout,
        )
        self.feed_forward = SwiGLUFeedForward(hidden_size, intermediate_size, dropout)

    def forward(
        self,
        inputs: torch.Tensor,
        past_key_value: PastKeyValue | None = None,
        use_cache: bool = False,
    ) -> tuple[torch.Tensor, PastKeyValue | None]:
        attn_output, present = self.attention(
            self.attn_norm(inputs),
            past_key_value=past_key_value,
            use_cache=use_cache,
        )
        hidden = inputs + attn_output
        ffn_output = self.feed_forward(self.ffn_norm(hidden))
        return hidden + ffn_output, present
