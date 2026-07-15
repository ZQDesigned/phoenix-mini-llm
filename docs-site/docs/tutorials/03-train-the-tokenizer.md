---
title: 03. 训练 Tokenizer
group:
  title: 复刻教程
  order: 0
order: 2
toc: content
---

# 03. 训练 Tokenizer

## 本章目标

这一章把上一章的数据纯函数串成真正可用的准备流水线。完成后，你应该已经能够：

- 使用 `tokenizers` 训练一个 BPE Tokenizer。
- 把 `train` / `validation` 文本批量编码成 token id 序列。
- 通过上一章的打包函数生成 `train.npy` 与 `validation.npy`。
- 写出 `artifacts/tokenizer/tokenizer.json`。
- 写出 `artifacts/prepare_metadata.json`，供训练和推理阶段读取真实词表大小与 special token id。

## 本章对应的仓库文件

- `src/phoenix_mini_llm/data/tokenizer.py`
- `src/phoenix_mini_llm/cli/common.py`
- `src/phoenix_mini_llm/cli/prepare_data.py`
- `tests/data/test_tokenizer.py`

## 先明确一件事：为什么 Tokenizer 要单独成章

Tokenizer 不是模型旁边一个可有可无的附件，它直接决定：

- 模型看到的基本单位是什么。
- `vocab_size` 最终是多少。
- `<bos>`、`<eos>`、`<pad>`、`<unk>` 的 id 分别是多少。
- 推理阶段输入 prompt 时究竟怎么编码。

如果这里处理模糊，后面的 `ModelConfig`、loss 维度、生成结果全部会跟着漂。

## 第一步：写 `data/tokenizer.py`

我们使用 Hugging Face 的 `tokenizers` 库训练 BPE。最终文件应该和下面的结构一致：

```python
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, cast

from tokenizers import Tokenizer
from tokenizers.decoders import ByteLevel as ByteLevelDecoder
from tokenizers.models import BPE
from tokenizers.pre_tokenizers import ByteLevel
from tokenizers.trainers import BpeTrainer

from phoenix_mini_llm.config import TokenizerConfig


@dataclass(slots=True)
class TokenizerArtifacts:
    tokenizer_path: Path
    pad_token_id: int
    bos_token_id: int
    eos_token_id: int
    unk_token_id: int


def train_bpe_tokenizer(
    texts: list[str],
    config: TokenizerConfig,
    output_dir: str | Path,
) -> TokenizerArtifacts:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    tokenizer = Tokenizer(BPE(unk_token=config.special_tokens[3]))
    tokenizer_config: Any = tokenizer
    tokenizer_config.pre_tokenizer = ByteLevel(add_prefix_space=False)
    tokenizer_config.decoder = ByteLevelDecoder()
    trainer = cast(Any, BpeTrainer)(
        vocab_size=config.vocab_size,
        min_frequency=config.min_frequency,
        special_tokens=config.special_tokens,
    )
    tokenizer.train_from_iterator(texts, trainer=trainer)

    tokenizer_path = output_path / "tokenizer.json"
    tokenizer.save(str(tokenizer_path))

    vocab = tokenizer.get_vocab()
    return TokenizerArtifacts(
        tokenizer_path=tokenizer_path,
        pad_token_id=vocab[config.special_tokens[0]],
        bos_token_id=vocab[config.special_tokens[1]],
        eos_token_id=vocab[config.special_tokens[2]],
        unk_token_id=vocab[config.special_tokens[3]],
    )


def load_tokenizer(path: str | Path) -> Tokenizer:
    return Tokenizer.from_file(str(path))
```

### 为什么这样写

- `TokenizerArtifacts` 不是多余包装，而是把“文件路径”和“关键 token id”打包成后续流程的明确输出。
- 这里不假设 `pad/bos/eos/unk` 的 id 永远是固定整数，而是训练后从词表实际读取。
- `load_tokenizer()` 单独封装，是为了让训练、评估、生成三个入口都用同一套加载方式。

## 第二步：写 `cli/common.py`

从这一章开始，多个 CLI 会共享一些路径和 metadata 逻辑，所以要抽出一个公共文件。

```python
from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from phoenix_mini_llm.config import RunConfig


def metadata_path(config: RunConfig) -> Path:
    return config.paths.artifacts_dir / "prepare_metadata.json"


def tokenizer_path(config: RunConfig) -> Path:
    return config.paths.artifacts_dir / "tokenizer" / "tokenizer.json"


def train_data_path(config: RunConfig) -> Path:
    return config.paths.data_dir / "train.npy"


def validation_data_path(config: RunConfig) -> Path:
    return config.paths.data_dir / "validation.npy"


def load_prepare_metadata(config: RunConfig) -> dict[str, Any]:
    return json.loads(metadata_path(config).read_text())


def apply_prepare_metadata(config: RunConfig, metadata: dict[str, Any]) -> None:
    config.model.vocab_size = int(metadata["vocab_size"])
    config.model.pad_token_id = int(metadata["special_token_ids"]["pad"])
    config.model.bos_token_id = int(metadata["special_token_ids"]["bos"])
    config.model.eos_token_id = int(metadata["special_token_ids"]["eos"])
    config.model.unk_token_id = int(metadata["special_token_ids"]["unk"])


def resolve_checkpoint_path(config: RunConfig, checkpoint: str) -> Path:
    if checkpoint != "latest":
        return Path(checkpoint)

    checkpoint_root = config.paths.checkpoints_dir / config.run_name
    candidates = sorted(checkpoint_root.glob("step-*.pt"))
    if not candidates:
        raise FileNotFoundError(f"no checkpoints found in {checkpoint_root}")
    return candidates[-1]
```

### 这里最重要的一点

`apply_prepare_metadata()` 会在训练和推理阶段把**真实 tokenizer 产物**回填进 `ModelConfig`。这一步至关重要，因为：

- 配置文件里的 `vocab_size` 只是目标值。
- 真正训练出来的词表大小、special token id 应该以 `prepare_metadata.json` 为准。

如果你跳过这一步，后面非常容易出现 embedding 维度和实际编码结果不一致的问题。

## 第三步：写 `cli/prepare_data.py`

这一章的核心是把前三个阶段的数据函数串成一个端到端入口。最终实现应该和下面的结构一致：

```python
from __future__ import annotations

import argparse
import json

from phoenix_mini_llm.cli.common import metadata_path
from phoenix_mini_llm.config import load_run_config
from phoenix_mini_llm.data.dataset import save_packed_tokens
from phoenix_mini_llm.data.download import download_tinystories_subset
from phoenix_mini_llm.data.normalize import normalize_story_batch
from phoenix_mini_llm.data.pack import pack_token_sequences
from phoenix_mini_llm.data.tokenizer import load_tokenizer, train_bpe_tokenizer
from phoenix_mini_llm.utils.logging import configure_logging


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Download and prepare TinyStories data.")
    parser.add_argument("--config", default="configs/debug.toml", help="Path to a TOML config file.")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    logger = configure_logging()
    config = load_run_config(args.config)
    config.paths.data_dir.mkdir(parents=True, exist_ok=True)
    config.paths.artifacts_dir.mkdir(parents=True, exist_ok=True)

    logger.info("Downloading TinyStories subset")
    train_texts = normalize_story_batch(download_tinystories_subset(config.dataset, "train"))
    validation_texts = normalize_story_batch(
        download_tinystories_subset(config.dataset, "validation")
    )

    logger.info("Training tokenizer on %s examples", len(train_texts))
    tokenizer_artifacts = train_bpe_tokenizer(
        texts=train_texts,
        config=config.tokenizer,
        output_dir=config.paths.artifacts_dir / "tokenizer",
    )
    tokenizer = load_tokenizer(tokenizer_artifacts.tokenizer_path)
    train_ids = [encoding.ids for encoding in tokenizer.encode_batch(train_texts)]
    validation_ids = [encoding.ids for encoding in tokenizer.encode_batch(validation_texts)]

    logger.info("Packing train and validation sequences")
    train_packed = pack_token_sequences(
        sequences=train_ids,
        sequence_length=config.model.max_seq_len,
        bos_token_id=tokenizer_artifacts.bos_token_id,
        eos_token_id=tokenizer_artifacts.eos_token_id,
    )
    validation_packed = pack_token_sequences(
        sequences=validation_ids,
        sequence_length=config.model.max_seq_len,
        bos_token_id=tokenizer_artifacts.bos_token_id,
        eos_token_id=tokenizer_artifacts.eos_token_id,
    )

    save_packed_tokens(config.paths.data_dir / "train.npy", train_packed)
    save_packed_tokens(config.paths.data_dir / "validation.npy", validation_packed)

    metadata = {
        "dataset_name": config.dataset.name,
        "train_examples": len(train_texts),
        "validation_examples": len(validation_texts),
        "train_sequences": int(train_packed.shape[0]),
        "validation_sequences": int(validation_packed.shape[0]),
        "vocab_size": tokenizer.get_vocab_size(),
        "special_token_ids": {
            "pad": tokenizer_artifacts.pad_token_id,
            "bos": tokenizer_artifacts.bos_token_id,
            "eos": tokenizer_artifacts.eos_token_id,
            "unk": tokenizer_artifacts.unk_token_id,
        },
    }
    metadata_path(config).write_text(json.dumps(metadata, indent=2))
    logger.info("Prepared dataset written to %s", config.paths.data_dir)
```

## 第四步：明确 `prepare_metadata.json` 应该长什么样

这份文件不是可选附加物，而是训练和生成阶段的重要输入。一个典型内容会像这样：

```json
{
  "dataset_name": "roneneldan/TinyStories",
  "train_examples": 2048,
  "validation_examples": 256,
  "train_sequences": 3618,
  "validation_sequences": 412,
  "vocab_size": 2048,
  "special_token_ids": {
    "pad": 0,
    "bos": 1,
    "eos": 2,
    "unk": 3
  }
}
```

数字会随配置与语料而变化，但字段结构必须稳定。

## 第五步：补上 Tokenizer 层测试

`tests/data/test_tokenizer.py` 至少应该验证下面这件事：Tokenizer 训练完之后，工件文件存在，而且 special token id 能被正确读取。

```python
from __future__ import annotations

from pathlib import Path

from phoenix_mini_llm.config import TokenizerConfig
from phoenix_mini_llm.data.tokenizer import load_tokenizer, train_bpe_tokenizer


def test_train_bpe_tokenizer_persists_tokenizer_and_special_tokens(tmp_path: Path) -> None:
    texts = [
        "The phoenix wakes at dawn.",
        "The phoenix learns from tiny stories.",
        "Tiny stories help the phoenix model speak.",
    ]
    config = TokenizerConfig(
        vocab_size=64,
        min_frequency=1,
        special_tokens=["<pad>", "<bos>", "<eos>", "<unk>"],
    )

    artifacts = train_bpe_tokenizer(texts=texts, config=config, output_dir=tmp_path)
    tokenizer = load_tokenizer(artifacts.tokenizer_path)
    encoded = tokenizer.encode("The phoenix wakes.")

    assert artifacts.tokenizer_path.exists()
    assert artifacts.pad_token_id == 0
    assert artifacts.bos_token_id == 1
    assert artifacts.eos_token_id == 2
    assert artifacts.unk_token_id == 3
    assert len(encoded.ids) > 0
```

## 本章结束后你应该执行什么

先跑数据测试：

```bash
uv run pytest tests/data/test_pack.py tests/data/test_tokenizer.py
```

然后真正执行准备流程：

```bash
uv run phoenix-prepare-data --config configs/debug.toml
```

成功后，仓库里至少应该出现这些工件：

```text
artifacts/tokenizer/tokenizer.json
artifacts/prepare_metadata.json
data/train.npy
data/validation.npy
```

## 如何确认结果和当前项目一致

你不需要追求和我机器上完全相同的样本数量，但需要确认这些结构性事实：

- `prepare_metadata.json` 包含 `dataset_name`、`vocab_size`、`special_token_ids`。
- `data/train.npy` 和 `data/validation.npy` 都是二维数组。
- `PackedTokenDataset.from_file()` 可以成功加载。
- `tokenizer.json` 能被 `load_tokenizer()` 重新打开。

你可以这样做一个快速检查：

```bash
uv run python - <<'PY'
import json
import numpy as np
from pathlib import Path

print(json.loads(Path("artifacts/prepare_metadata.json").read_text()))
train = np.load("data/train.npy")
print(train.shape, train.dtype)
PY
```

## 常见偏差

### 偏差 1：训练完 Tokenizer 后直接假设 special token id 顺序

你当然可能在很多运行里看到 `<pad>/<bos>/<eos>/<unk>` 分别是 `0/1/2/3`，但教程里不要依赖“看起来通常如此”。最稳妥的做法永远是训练后读词表并保存 metadata。

### 偏差 2：只准备训练集，不准备验证集

这样后面一进训练阶段就没法做评估，也没法判断 loss 下降是不是过拟合。

### 偏差 3：把 `vocab_size` 只留在配置文件里，不回填 metadata

这会直接导致后续模型 embedding 尺寸和真实 tokenizer 输出之间可能出现偏差。

<Callout title="相关踩坑" tone="warning">
  如果后面模型初始化或加载 checkpoint 时出现维度不匹配，优先检查 `prepare_metadata.json` 是否存在，以及训练和推理入口是否真的调用了 `apply_prepare_metadata()`。具体见 [04. Tokenizer 元数据同步](/pitfalls/04-tokenizer-metadata-sync)。
</Callout>

## 本章完成后的阶段检查点

```bash
git add .
git commit -m "tutorial-step-03"
```

## 下一章做什么

下一章会开始进入训练阶段，但还不会直接上完整 Transformer。我们先把“一个 batch 如何前向、反向、更新参数、评估 loss”这套闭环写扎实，再把真正模型接上去。
