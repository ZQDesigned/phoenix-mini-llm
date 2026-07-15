from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import tomllib


@dataclass(slots=True)
class ProjectPaths:
    project_root: Path
    data_dir: Path
    artifacts_dir: Path
    runs_dir: Path
    checkpoints_dir: Path

    def resolve(self) -> "ProjectPaths":
        return ProjectPaths(
            project_root=self.project_root.resolve(),
            data_dir=self._resolve_path(self.data_dir),
            artifacts_dir=self._resolve_path(self.artifacts_dir),
            runs_dir=self._resolve_path(self.runs_dir),
            checkpoints_dir=self._resolve_path(self.checkpoints_dir),
        )

    def _resolve_path(self, value: Path) -> Path:
        if value.is_absolute():
            return value
        return (self.project_root / value).resolve()


@dataclass(slots=True)
class DatasetConfig:
    name: str
    streaming: bool
    max_train_examples: int
    max_validation_examples: int
    text_key: str


@dataclass(slots=True)
class TokenizerConfig:
    vocab_size: int
    min_frequency: int
    special_tokens: list[str]

    def __post_init__(self) -> None:
        if len(self.special_tokens) < 4:
            raise ValueError("special_tokens must include pad, bos, eos, and unk tokens")


@dataclass(slots=True)
class ModelConfig:
    hidden_size: int
    num_layers: int
    num_heads: int
    intermediate_size: int
    max_seq_len: int
    dropout: float
    rope_theta: float
    rms_norm_eps: float
    vocab_size: int
    pad_token_id: int
    bos_token_id: int
    eos_token_id: int
    unk_token_id: int = 3

    def __post_init__(self) -> None:
        if self.hidden_size % self.num_heads != 0:
            raise ValueError("hidden_size must be divisible by num_heads")


@dataclass(slots=True)
class TrainingConfig:
    seed: int
    batch_size: int
    gradient_accumulation_steps: int
    learning_rate: float
    weight_decay: float
    adam_beta1: float
    adam_beta2: float
    warmup_steps: int
    max_steps: int
    eval_interval: int
    save_interval: int
    log_interval: int
    gradient_clip_norm: float
    num_workers: int
    amp: bool

    def __post_init__(self) -> None:
        if self.max_steps <= 0:
            raise ValueError("max_steps must be positive")


@dataclass(slots=True)
class GenerationConfig:
    max_new_tokens: int
    temperature: float
    top_k: int
    top_p: float


@dataclass(slots=True)
class RunConfig:
    run_name: str
    paths: ProjectPaths
    dataset: DatasetConfig
    tokenizer: TokenizerConfig
    model: ModelConfig
    training: TrainingConfig
    generation: GenerationConfig
    source_config_path: Path


def load_run_config(config_path: str | Path) -> RunConfig:
    path = Path(config_path).resolve()
    raw = tomllib.loads(path.read_text())
    project_root = path.parent.parent

    paths = ProjectPaths(
        project_root=project_root,
        data_dir=Path(raw["paths"]["data_dir"]),
        artifacts_dir=Path(raw["paths"]["artifacts_dir"]),
        runs_dir=Path(raw["paths"]["runs_dir"]),
        checkpoints_dir=Path(raw["paths"]["checkpoints_dir"]),
    ).resolve()

    tokenizer = TokenizerConfig(
        vocab_size=raw["tokenizer"]["vocab_size"],
        min_frequency=raw["tokenizer"]["min_frequency"],
        special_tokens=list(raw["tokenizer"]["special_tokens"]),
    )

    model = ModelConfig(
        hidden_size=raw["model"]["hidden_size"],
        num_layers=raw["model"]["num_layers"],
        num_heads=raw["model"]["num_heads"],
        intermediate_size=raw["model"]["intermediate_size"],
        max_seq_len=raw["model"]["max_seq_len"],
        dropout=raw["model"]["dropout"],
        rope_theta=raw["model"]["rope_theta"],
        rms_norm_eps=raw["model"]["rms_norm_eps"],
        vocab_size=tokenizer.vocab_size,
        pad_token_id=0,
        bos_token_id=1,
        eos_token_id=2,
        unk_token_id=3,
    )

    return RunConfig(
        run_name=raw["run_name"],
        paths=paths,
        dataset=DatasetConfig(**raw["dataset"]),
        tokenizer=tokenizer,
        model=model,
        training=TrainingConfig(**raw["training"]),
        generation=GenerationConfig(**raw["generation"]),
        source_config_path=path,
    )
