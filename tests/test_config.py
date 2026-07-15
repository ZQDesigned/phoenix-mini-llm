from __future__ import annotations

from pathlib import Path

import pytest
import torch

from phoenix_mini_llm.config import ModelConfig, ProjectPaths, TrainingConfig, load_run_config
from phoenix_mini_llm.utils.device import build_amp_context, detect_device


def test_project_paths_resolve_relative_directories(tmp_path: Path) -> None:
    paths = ProjectPaths(
        project_root=tmp_path,
        data_dir=Path("data"),
        artifacts_dir=Path("artifacts"),
        runs_dir=Path("runs"),
        checkpoints_dir=Path("checkpoints"),
    )

    resolved = paths.resolve()

    assert resolved.data_dir == tmp_path / "data"
    assert resolved.artifacts_dir == tmp_path / "artifacts"
    assert resolved.runs_dir == tmp_path / "runs"
    assert resolved.checkpoints_dir == tmp_path / "checkpoints"


def test_model_config_requires_hidden_size_divisible_by_num_heads() -> None:
    with pytest.raises(ValueError, match="hidden_size must be divisible by num_heads"):
        ModelConfig(
            hidden_size=130,
            num_layers=2,
            num_heads=4,
            intermediate_size=512,
            max_seq_len=64,
            dropout=0.1,
            rope_theta=10_000.0,
            rms_norm_eps=1e-5,
            vocab_size=512,
            pad_token_id=0,
            bos_token_id=1,
            eos_token_id=2,
        )


def test_training_config_requires_positive_max_steps() -> None:
    with pytest.raises(ValueError, match="max_steps must be positive"):
        TrainingConfig(
            seed=7,
            batch_size=4,
            gradient_accumulation_steps=1,
            learning_rate=3e-4,
            weight_decay=0.1,
            adam_beta1=0.9,
            adam_beta2=0.95,
            warmup_steps=0,
            max_steps=0,
            eval_interval=10,
            save_interval=10,
            log_interval=1,
            gradient_clip_norm=1.0,
            num_workers=0,
            amp=False,
        )


def test_load_run_config_derives_project_root_from_config_path(tmp_path: Path) -> None:
    project_root = tmp_path
    config_dir = project_root / "configs"
    config_dir.mkdir()
    config_path = config_dir / "unit.toml"
    config_path.write_text(
        """
run_name = "unit"

[paths]
data_dir = "data"
artifacts_dir = "artifacts"
runs_dir = "runs"
checkpoints_dir = "checkpoints"

[dataset]
name = "example/dataset"
streaming = true
max_train_examples = 10
max_validation_examples = 4
text_key = "text"

[tokenizer]
vocab_size = 256
min_frequency = 2
special_tokens = ["<pad>", "<bos>", "<eos>", "<unk>"]

[model]
hidden_size = 128
num_layers = 2
num_heads = 4
intermediate_size = 512
max_seq_len = 64
dropout = 0.1
rope_theta = 10000.0
rms_norm_eps = 1e-5

[training]
seed = 7
batch_size = 2
gradient_accumulation_steps = 1
learning_rate = 0.001
weight_decay = 0.1
adam_beta1 = 0.9
adam_beta2 = 0.95
warmup_steps = 0
max_steps = 5
eval_interval = 5
save_interval = 5
log_interval = 1
gradient_clip_norm = 1.0
num_workers = 0
amp = false

[generation]
max_new_tokens = 16
temperature = 0.8
top_k = 10
top_p = 0.95
""".strip()
    )

    config = load_run_config(config_path)

    assert config.paths.project_root == project_root
    assert config.paths.data_dir == project_root / "data"
    assert config.model.vocab_size == 256
    assert config.model.pad_token_id == 0
    assert config.generation.max_new_tokens == 16


def test_detect_device_prefers_cuda_then_mps_then_cpu(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(torch.cuda, "is_available", lambda: True)
    monkeypatch.setattr(torch.backends.mps, "is_available", lambda: True)

    assert detect_device().type == "cuda"

    monkeypatch.setattr(torch.cuda, "is_available", lambda: False)

    assert detect_device().type == "mps"

    monkeypatch.setattr(torch.backends.mps, "is_available", lambda: False)

    assert detect_device().type == "cpu"


def test_build_amp_context_falls_back_to_nullcontext_on_cpu() -> None:
    context = build_amp_context(torch.device("cpu"), enabled=True)

    with context:
        value = 1 + 1

    assert value == 2
