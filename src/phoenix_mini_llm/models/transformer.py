from __future__ import annotations

from dataclasses import dataclass

import torch
from torch import nn

from phoenix_mini_llm.config import ModelConfig
from phoenix_mini_llm.models.cache import PastKeyValues
from phoenix_mini_llm.models.layers import RMSNorm, TransformerBlock


@dataclass(slots=True)
class ModelOutput:
    logits: torch.Tensor
    loss: torch.Tensor | None = None
    past_key_values: PastKeyValues | None = None


class PhoenixMiniLM(nn.Module):
    def __init__(self, config: ModelConfig) -> None:
        super().__init__()
        self.config = config
        self.token_embeddings = nn.Embedding(config.vocab_size, config.hidden_size)
        self.dropout = nn.Dropout(config.dropout)
        self.blocks = nn.ModuleList(
            [
                TransformerBlock(
                    hidden_size=config.hidden_size,
                    num_heads=config.num_heads,
                    intermediate_size=config.intermediate_size,
                    max_seq_len=config.max_seq_len,
                    rope_theta=config.rope_theta,
                    rms_norm_eps=config.rms_norm_eps,
                    dropout=config.dropout,
                )
                for _ in range(config.num_layers)
            ]
        )
        self.final_norm = RMSNorm(config.hidden_size, config.rms_norm_eps)
        self.lm_head = nn.Linear(config.hidden_size, config.vocab_size, bias=False)
        self.lm_head.weight = self.token_embeddings.weight
        self.apply(self._init_weights)

    def forward(
        self,
        input_ids: torch.Tensor,
        targets: torch.Tensor | None = None,
        use_cache: bool = False,
        past_key_values: PastKeyValues | None = None,
    ) -> ModelOutput:
        if input_ids.ndim != 2:
            raise ValueError("input_ids must have shape [batch, sequence]")

        hidden = self.dropout(self.token_embeddings(input_ids))
        next_past: PastKeyValues | None = [] if use_cache else None

        for layer_index, block in enumerate(self.blocks):
            layer_past = None if past_key_values is None else past_key_values[layer_index]
            hidden, present = block(hidden, past_key_value=layer_past, use_cache=use_cache)
            if next_past is not None and present is not None:
                next_past.append(present)

        logits = self.lm_head(self.final_norm(hidden))
        loss = None
        if targets is not None:
            loss = torch.nn.functional.cross_entropy(
                logits.view(-1, logits.size(-1)),
                targets.view(-1),
            )
        return ModelOutput(logits=logits, loss=loss, past_key_values=next_past)

    def _init_weights(self, module: nn.Module) -> None:
        if isinstance(module, nn.Linear | nn.Embedding):
            nn.init.normal_(module.weight, mean=0.0, std=0.02)
