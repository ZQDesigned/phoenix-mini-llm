---
title: 01. 建立项目骨架
group:
  title: 复刻教程
  order: 0
order: 0
toc: content
---

# 01. 建立项目骨架

## 本章目标

这一章不是只把目录“摆出来”，而是要把后面 9 章都会依赖的工程约束一次定死。完成后，你应该已经拥有：

- 一个由 `uv` 管理的 Python 项目。
- 固定的源码包结构 `src/phoenix_mini_llm/`。
- 三套配置文件：`debug`、`dev`、`train`。
- 四个命令行入口：`phoenix-prepare-data`、`phoenix-train`、`phoenix-evaluate`、`phoenix-generate`。
- 一个可扩展的配置加载层 `src/phoenix_mini_llm/config.py`。

如果这一章做得含糊，后面所有章节都会不断返工。

## 本章完成后的目录应该长什么样

```text
phoenix-mini-llm/
├── pyproject.toml
├── README.md
├── .gitignore
├── configs/
│   ├── debug.toml
│   ├── dev.toml
│   └── train.toml
├── scripts/
│   ├── prepare_data.py
│   ├── train.py
│   ├── evaluate.py
│   └── generate.py
├── src/
│   └── phoenix_mini_llm/
│       ├── __init__.py
│       ├── config.py
│       └── cli/
│           ├── __init__.py
│           ├── prepare_data.py
│           ├── train.py
│           ├── evaluate.py
│           ├── generate.py
│           └── common.py
└── tests/
```

你现在还没有真正的模型和数据逻辑，但入口、配置和目录职责必须已经稳定。

## 本章对应的仓库文件

- `pyproject.toml`
- `.gitignore`
- `configs/debug.toml`
- `configs/dev.toml`
- `configs/train.toml`
- `src/phoenix_mini_llm/__init__.py`
- `src/phoenix_mini_llm/config.py`
- `src/phoenix_mini_llm/cli/__init__.py`
- `src/phoenix_mini_llm/cli/common.py`
- `src/phoenix_mini_llm/cli/prepare_data.py`
- `src/phoenix_mini_llm/cli/train.py`
- `src/phoenix_mini_llm/cli/evaluate.py`
- `src/phoenix_mini_llm/cli/generate.py`
- `scripts/prepare_data.py`
- `scripts/train.py`
- `scripts/evaluate.py`
- `scripts/generate.py`

## 实现顺序

1. 用 `uv` 初始化项目并安装依赖。
2. 把 `pyproject.toml` 固定成和仓库一致的脚本、测试和构建配置。
3. 建出 `src/` 源码包结构。
4. 一次性写好 `config.py`，把后续所有配置对象的形状先定下来。
5. 写三套 TOML 运行配置。
6. 建立 CLI 文件和 `scripts/` 包装脚本。
7. 修好 `.gitignore`，避免误伤 `src/.../data` 和 `tests/data` 这类目录。

## 第一步：初始化 `uv` 项目

```bash
mkdir phoenix-mini-llm
cd phoenix-mini-llm

uv init --package
uv add torch datasets tokenizers numpy tqdm safetensors
uv add --dev pytest pytest-cov ruff pyright
```

然后补齐基础目录：

```bash
mkdir -p configs scripts tests
mkdir -p src/phoenix_mini_llm/cli
touch src/phoenix_mini_llm/__init__.py
touch src/phoenix_mini_llm/cli/__init__.py
```

## 第二步：把 `pyproject.toml` 一次定型

这一份文件不要只写最小可运行配置。你应该直接把最终项目需要的脚本、测试和静态检查入口定好：

```toml
[project]
name = "phoenix-mini-llm"
version = "0.1.0"
description = "A beginner-friendly decoder-only language model project built from scratch."
readme = "README.md"
requires-python = ">=3.11,<3.13"
authors = [{ name = "Zou Quan" }]
dependencies = [
  "datasets>=4.0.0,<5.0.0",
  "numpy>=2.0.0,<3.0.0",
  "safetensors>=0.5.0,<1.0.0",
  "tokenizers>=0.21.0,<0.22.0",
  "torch>=2.7.0,<3.0.0",
  "tqdm>=4.67.0,<5.0.0",
]

[dependency-groups]
dev = [
  "pyright>=1.1.403,<2.0.0",
  "pytest>=8.4.0,<9.0.0",
  "pytest-cov>=6.2.0,<7.0.0",
  "ruff>=0.12.0,<0.13.0",
]

[project.scripts]
phoenix-prepare-data = "phoenix_mini_llm.cli.prepare_data:main"
phoenix-train = "phoenix_mini_llm.cli.train:main"
phoenix-evaluate = "phoenix_mini_llm.cli.evaluate:main"
phoenix-generate = "phoenix_mini_llm.cli.generate:main"

[build-system]
requires = ["hatchling>=1.27.0"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/phoenix_mini_llm"]

[tool.pytest.ini_options]
testpaths = ["tests"]
pythonpath = ["src"]
addopts = "-ra"

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B"]

[tool.pyright]
pythonVersion = "3.11"
typeCheckingMode = "standard"
include = ["src", "tests"]
```

### 为什么这里就要写完整

- `project.scripts` 决定后面所有教程都用哪组命令名。
- `pythonpath = ["src"]` 决定测试如何导入源码包。
- `requires-python` 和 `pyright` 版本范围决定跨平台兼容策略。
- `build-system` 固定后，后续打包、安装和入口加载行为才不会摇摆。

## 第三步：把 `.gitignore` 写精确

这里必须避免一个常见坑：根目录的生成数据目录和源码目录里的 `data/` 包不能混为一谈。

建议直接写成：

```gitignore
.venv/
__pycache__/
*.py[cod]
.pytest_cache/
.ruff_cache/
.pyright/
.coverage
htmlcov/

.DS_Store
.idea/

/data/
/artifacts/
/runs/
/checkpoints/
/outputs/
/output/
.playwright-cli/
```

注意上面的 `/data/`、`/artifacts/` 都带了前导 `/`。这表示“只忽略仓库根目录下的生成目录”，不会误伤 `src/phoenix_mini_llm/data/` 或 `tests/data/`。

> **相关踩坑**
>
>   如果你把这里写成 `data/`，后面在实现 `src/phoenix_mini_llm/data/` 时很容易碰上 Git 不追踪文件的问题。具体诊断过程见 [02. .gitignore 误伤 data 包](/pitfalls/02-gitignore-and-package-names.md)。

## 第四步：先把配置模型写出来

`src/phoenix_mini_llm/config.py` 是这个项目的“类型边界”。它把 TOML 配置解析成 Python 对象，并负责把相对路径解析到项目根目录。

现在就把它写完整，后面每一章都直接复用。

```python
from __future__ import annotations

import tomllib
from dataclasses import dataclass
from pathlib import Path


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
```

### 这里最关键的设计点

- `ProjectPaths.resolve()` 让所有路径都从配置文件所属项目根目录出发，不写死系统绝对路径。
- `TokenizerConfig` 和 `ModelConfig` 通过 `__post_init__` 做最早期的参数合法性检查。
- `ModelConfig.vocab_size` 先取自 tokenizer 配置，后续再由 `prepare_metadata.json` 覆盖成真实词表大小。

## 第五步：写三套 TOML 配置

你需要三套规模逐步增长的配置：

- `configs/debug.toml`
- `configs/dev.toml`
- `configs/train.toml`

它们共享同一套字段，只是在数据规模、模型规模和训练步数上不同。

### `configs/debug.toml`

```toml
run_name = "debug"

[paths]
data_dir = "data"
artifacts_dir = "artifacts"
runs_dir = "runs"
checkpoints_dir = "checkpoints"

[dataset]
name = "roneneldan/TinyStories"
streaming = true
max_train_examples = 2048
max_validation_examples = 256
text_key = "text"

[tokenizer]
vocab_size = 2048
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
batch_size = 4
gradient_accumulation_steps = 1
learning_rate = 0.0003
weight_decay = 0.1
adam_beta1 = 0.9
adam_beta2 = 0.95
warmup_steps = 10
max_steps = 20
eval_interval = 5
save_interval = 10
log_interval = 1
gradient_clip_norm = 1.0
num_workers = 0
amp = false

[generation]
max_new_tokens = 32
temperature = 0.8
top_k = 20
top_p = 0.95
```

### `configs/dev.toml`

只把规模往上提一档：

```toml
run_name = "dev"

[paths]
data_dir = "data"
artifacts_dir = "artifacts"
runs_dir = "runs"
checkpoints_dir = "checkpoints"

[dataset]
name = "roneneldan/TinyStories"
streaming = true
max_train_examples = 20000
max_validation_examples = 1000
text_key = "text"

[tokenizer]
vocab_size = 4096
min_frequency = 2
special_tokens = ["<pad>", "<bos>", "<eos>", "<unk>"]

[model]
hidden_size = 256
num_layers = 4
num_heads = 4
intermediate_size = 1024
max_seq_len = 128
dropout = 0.1
rope_theta = 10000.0
rms_norm_eps = 1e-5

[training]
seed = 7
batch_size = 8
gradient_accumulation_steps = 2
learning_rate = 0.00025
weight_decay = 0.1
adam_beta1 = 0.9
adam_beta2 = 0.95
warmup_steps = 20
max_steps = 200
eval_interval = 20
save_interval = 50
log_interval = 5
gradient_clip_norm = 1.0
num_workers = 0
amp = false

[generation]
max_new_tokens = 64
temperature = 0.8
top_k = 40
top_p = 0.95
```

### `configs/train.toml`

这一套配置对应 Windows CUDA 或显存更宽裕时的正式训练：

```toml
run_name = "train"

[paths]
data_dir = "data"
artifacts_dir = "artifacts"
runs_dir = "runs"
checkpoints_dir = "checkpoints"

[dataset]
name = "roneneldan/TinyStories"
streaming = true
max_train_examples = 120000
max_validation_examples = 4000
text_key = "text"

[tokenizer]
vocab_size = 8192
min_frequency = 2
special_tokens = ["<pad>", "<bos>", "<eos>", "<unk>"]

[model]
hidden_size = 384
num_layers = 6
num_heads = 6
intermediate_size = 1536
max_seq_len = 256
dropout = 0.1
rope_theta = 10000.0
rms_norm_eps = 1e-5

[training]
seed = 7
batch_size = 4
gradient_accumulation_steps = 8
learning_rate = 0.0002
weight_decay = 0.1
adam_beta1 = 0.9
adam_beta2 = 0.95
warmup_steps = 100
max_steps = 2000
eval_interval = 100
save_interval = 250
log_interval = 10
gradient_clip_norm = 1.0
num_workers = 0
amp = true

[generation]
max_new_tokens = 128
temperature = 0.8
top_k = 50
top_p = 0.95
```

## 第六步：先把 CLI 和 `scripts/` 包装层搭出来

`src/phoenix_mini_llm/cli/*.py` 现在还可以先只放 `main()` 骨架，但文件名、职责和导入路径必须先固定。

例如 `scripts/train.py`：

```python
from phoenix_mini_llm.cli.train import main

if __name__ == "__main__":
    main()
```

`prepare_data.py`、`evaluate.py`、`generate.py` 也同样处理。这样做的目的有两个：

- `uv run phoenix-train` 和 `python scripts/train.py` 都能指向同一份真实实现。
- 之后如果你想接 CI、定时任务或远程执行，不需要再改命令形态。

## 本章结束后你应该检查什么

先同步环境：

```bash
uv sync
```

然后检查：

```bash
uv run python -c "from phoenix_mini_llm.config import load_run_config; cfg = load_run_config('configs/debug.toml'); print(cfg.run_name, cfg.model.hidden_size)"
uv run python -c "import phoenix_mini_llm"
uv run python -c "from pathlib import Path; print((Path('src') / 'phoenix_mini_llm').exists())"
```

你应该看到：

- 配置加载成功，输出 `debug 128`。
- 源码包可导入。
- `src/phoenix_mini_llm` 目录存在。

## 常见偏差

### 偏差 1：把配置写成 JSON 或 YAML

当前项目用的是 TOML，因为：

- `uv` / Python 生态天然支持度高。
- 数值和层级配置可读性好。
- 不必额外引入解析依赖。

### 偏差 2：只保留一份配置

如果你只有一个配置文件，你很快就会在“本地调试”和“正式训练”之间来回改参数，导致结果不可复现。

### 偏差 3：CLI 名称没有固定

如果现在还在想“以后再说命令名”，后面文档、脚本和 README 都会不断改动。工程化项目里，命令面本身就是公共接口。

> **相关学习章节**
>
>   如果你对 `uv`、路径解析、配置分层的意义还不够稳，回到 [卷十一. 训练一个小型语言模型](/learning/volume-11-training-a-small-language-model/index.md) 并对照 [02. .gitignore 误伤 data 包](/pitfalls/02-gitignore-and-package-names.md)。

## 本章完成后的阶段检查点

建议提交：

```bash
git add .
git commit -m "tutorial-step-01"
```

## 下一章做什么

下一章开始实现真正的数据管线：你会写 `download.py`、`normalize.py`、`pack.py` 和 `dataset.py`，把原始文本整理成后面训练循环能直接消费的 token 序列。
