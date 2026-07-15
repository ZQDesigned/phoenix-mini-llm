from __future__ import annotations

from pathlib import Path

import torch

from phoenix_mini_llm.config import ModelConfig, TrainingConfig
from phoenix_mini_llm.models.transformer import PhoenixMiniLM
from phoenix_mini_llm.training.checkpoints import load_checkpoint, save_checkpoint
from phoenix_mini_llm.training.optim import build_optimizer, build_scheduler


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


def build_training_config() -> TrainingConfig:
    return TrainingConfig(
        seed=7,
        batch_size=2,
        gradient_accumulation_steps=1,
        learning_rate=3e-4,
        weight_decay=0.1,
        adam_beta1=0.9,
        adam_beta2=0.95,
        warmup_steps=0,
        max_steps=10,
        eval_interval=2,
        save_interval=2,
        log_interval=1,
        gradient_clip_norm=1.0,
        num_workers=0,
        amp=False,
    )


def test_checkpoint_round_trip_restores_model_and_optimizer(tmp_path: Path) -> None:
    torch.manual_seed(0)
    model = build_model()
    training_config = build_training_config()
    optimizer = build_optimizer(model, training_config)
    scheduler = build_scheduler(optimizer, training_config)
    checkpoint_path = tmp_path / "checkpoint.pt"
    original = model.token_embeddings.weight.detach().clone()
    optimizer.step()
    scheduler.step()
    scheduler_last_epoch = scheduler.last_epoch

    save_checkpoint(
        checkpoint_path,
        model=model,
        optimizer=optimizer,
        scheduler=scheduler,
        step=3,
        metadata={"run": "test"},
    )
    with torch.no_grad():
        model.token_embeddings.weight.add_(1.0)
    scheduler.step()

    state = load_checkpoint(
        checkpoint_path,
        model=model,
        optimizer=optimizer,
        scheduler=scheduler,
        device=torch.device("cpu"),
    )

    assert state.step == 3
    assert state.metadata["run"] == "test"
    assert scheduler.last_epoch == scheduler_last_epoch
    torch.testing.assert_close(model.token_embeddings.weight, original)
