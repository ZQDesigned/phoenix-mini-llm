from __future__ import annotations

import math

from torch import nn
from torch.optim import AdamW, Optimizer
from torch.optim.lr_scheduler import LambdaLR

from phoenix_mini_llm.config import TrainingConfig


def build_optimizer(model: nn.Module, config: TrainingConfig) -> Optimizer:
    return AdamW(
        model.parameters(),
        lr=config.learning_rate,
        betas=(config.adam_beta1, config.adam_beta2),
        weight_decay=config.weight_decay,
    )


def build_scheduler(optimizer: Optimizer, config: TrainingConfig) -> LambdaLR:
    def lr_lambda(step: int) -> float:
        if step < config.warmup_steps and config.warmup_steps > 0:
            return (step + 1) / config.warmup_steps

        if config.max_steps <= config.warmup_steps:
            return 1.0

        progress = (step - config.warmup_steps) / (config.max_steps - config.warmup_steps)
        return 0.1 + 0.9 * 0.5 * (1.0 + math.cos(math.pi * progress))

    return LambdaLR(optimizer, lr_lambda=lr_lambda)
