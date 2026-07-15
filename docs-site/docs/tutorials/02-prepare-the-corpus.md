---
title: 02. 准备语料与数据管线
group:
  title: 复刻教程
  order: 0
order: 1
toc: content
---

# 02. 准备语料与数据管线

## 本章目标

这一章的任务不是“把数据下载下来就算完成”，而是写出一条稳定、可测试、和最终训练链路兼容的数据准备底座。完成后，你应该已经拥有：

- 从 Hugging Face 流式读取 TinyStories 子集的函数。
- 最小必要的文本标准化逻辑。
- 把 token id 序列打包成定长训练块的纯函数。
- 能直接被 `DataLoader` 消费的数据集类。
- 覆盖这些纯函数的单元测试。

注意，这一章还**不会**训练 Tokenizer，也不会生成最终的 `.npy` 文件。我们先把数据阶段的核心函数写对，下一章再接上 Tokenizer 和 CLI。

## 本章对应的仓库文件

- `src/phoenix_mini_llm/data/download.py`
- `src/phoenix_mini_llm/data/normalize.py`
- `src/phoenix_mini_llm/data/pack.py`
- `src/phoenix_mini_llm/data/dataset.py`
- `src/phoenix_mini_llm/data/__init__.py`
- `tests/data/test_pack.py`

## 为什么现在先写这些纯函数

如果你一开始就把“下载数据、训练 Tokenizer、打包样本、保存文件”全部塞进一个脚本，短期看似省事，长期一定会导致两个问题：

1. 你很难定位错误到底出在“数据来源”“清洗”“分块”还是“Tokenizer”。
2. 你很难给数据处理写稳定的测试，因为所有逻辑都耦合在 I/O 和远程下载里。

所以这一步的原则是：

> 把和数据形态相关的核心逻辑写成独立纯函数，后续 CLI 只是调度这些函数。

## 第一步：明确输入数据源

当前项目统一使用：

```text
roneneldan/TinyStories
```

这不是随便选的。它满足几个非常重要的学习项目条件：

- 语料文本相对干净，不需要大规模清洗。
- 单条故事普遍较短，便于快速观察训练是否收敛。
- 流式读取体验好，适合小显存与学习型工程。
- 社区使用广泛，出现结果偏差时更容易交叉验证。

## 第二步：写 `download.py`

你需要一个函数，负责：

- 按 `train` / `validation` split 加载数据集。
- 根据配置里的 `max_train_examples` 或 `max_validation_examples` 截断样本数。
- 只提取配置中指定的文本字段。

最终文件应该和下面的结构一致：

```python
from __future__ import annotations

from collections.abc import Iterable, Mapping
from typing import cast

from datasets import load_dataset

from phoenix_mini_llm.config import DatasetConfig


def collect_text_examples(
    records: Iterable[object],
    text_key: str,
    limit: int,
) -> list[str]:
    texts: list[str] = []
    for record in records:
        if not isinstance(record, Mapping):
            continue
        value = record.get(text_key)
        if isinstance(value, str):
            texts.append(value)
        if len(texts) >= limit:
            break
    return texts


def download_tinystories_subset(config: DatasetConfig, split: str) -> list[str]:
    dataset = load_dataset(config.name, split=split, streaming=config.streaming)
    limit = config.max_train_examples if split == "train" else config.max_validation_examples
    return collect_text_examples(
        cast(Iterable[object], dataset),
        text_key=config.text_key,
        limit=limit,
    )
```

### 这段代码的关键点

- `collect_text_examples()` 和 Hugging Face 数据集本身解耦，因此你可以单独测试“如何提取文本”。
- 这里只接受 `Mapping` 且字段值必须是 `str`，避免把意外结构带入后续阶段。
- 截断发生在迭代过程中，而不是先把流式数据全部拉到内存。

## 第三步：写 `normalize.py`

TinyStories 已经相对干净，所以这里的目标不是“强清洗”，而是“统一最基础的文本形态”。

最终实现：

```python
from __future__ import annotations


def normalize_story_text(text: str) -> str:
    normalized = text.replace("\r\n", "\n").replace("\r", "\n").strip()
    return "\n".join(line.rstrip() for line in normalized.splitlines())


def normalize_story_batch(texts: list[str]) -> list[str]:
    return [normalize_story_text(text) for text in texts if normalize_story_text(text)]
```

### 为什么只做这几步

- 统一换行符，避免不同平台文本格式不一致。
- `strip()` 去掉头尾空白，减少无意义样本差异。
- `rstrip()` 清理每行末尾空格，但不破坏句子内部内容。

不要在这里做这些事：

- 大量删除标点。
- 全部转小写。
- 过滤“看起来无用”的句子。

那些操作会改变语料分布，而你在训练观察中很难意识到偏差来自这里。

## 第四步：写 `pack.py`

这是数据阶段最容易写错、也最值得单元测试的一步。目标是把“变长 token 序列”拼成“定长训练块”，并为 next-token prediction 保留一位偏移空间。

最终实现：

```python
from __future__ import annotations

import numpy as np


def pack_token_sequences(
    sequences: list[list[int]],
    sequence_length: int,
    bos_token_id: int,
    eos_token_id: int,
) -> np.ndarray:
    flattened: list[int] = []
    for sequence in sequences:
        flattened.extend([bos_token_id, *sequence, eos_token_id])

    chunk_size = sequence_length + 1
    usable_tokens = len(flattened) // chunk_size * chunk_size
    if usable_tokens == 0:
        return np.zeros((0, chunk_size), dtype=np.int64)

    array = np.array(flattened[:usable_tokens], dtype=np.int64)
    return array.reshape(-1, chunk_size)
```

### 为什么是 `sequence_length + 1`

因为训练时你需要把同一行拆成：

```text
input_ids = row[:-1]
targets   = row[1:]
```

如果你只按 `sequence_length` 切块，就没有多出来的那一位去构造目标序列。

### 为什么要显式加 `bos` / `eos`

- 给样本边界一个明确的开始和结束标记。
- 防止不同故事之间无边界地直接拼接。
- 让后续生成时有与训练阶段一致的序列约束。

## 第五步：写 `dataset.py`

这一步要把打包后的二维 `numpy.ndarray` 变成训练循环可以直接读取的数据集。

最终实现：

```python
from __future__ import annotations

from pathlib import Path

import numpy as np
import torch
from torch.utils.data import Dataset


class PackedTokenDataset(Dataset[tuple[torch.Tensor, torch.Tensor]]):
    def __init__(self, packed_tokens: np.ndarray) -> None:
        if packed_tokens.ndim != 2:
            raise ValueError("packed_tokens must be a 2D array")
        self.packed_tokens = packed_tokens

    def __len__(self) -> int:
        return int(self.packed_tokens.shape[0])

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor]:
        row = self.packed_tokens[index]
        input_ids = torch.tensor(row[:-1], dtype=torch.long)
        targets = torch.tensor(row[1:], dtype=torch.long)
        return input_ids, targets

    @classmethod
    def from_file(cls, path: str | Path) -> "PackedTokenDataset":
        return cls(np.load(path))


def save_packed_tokens(path: str | Path, packed_tokens: np.ndarray) -> None:
    output_path = Path(path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    np.save(output_path, packed_tokens)
```

### 这里要特别确认两件事

- `packed_tokens` 必须是二维数组，每一行就是一个训练块。
- `__getitem__()` 里要返回 `(input_ids, targets)` 二元组，而不是整行原样输出。

## 第六步：补上数据层测试

这一章必须给数据逻辑写测试，因为它们都是纯函数，测试成本最低、收益最高。

`tests/data/test_pack.py` 应该至少覆盖下面三个事实：

```python
from __future__ import annotations

import numpy as np
import torch

from phoenix_mini_llm.data.dataset import PackedTokenDataset
from phoenix_mini_llm.data.normalize import normalize_story_text
from phoenix_mini_llm.data.pack import pack_token_sequences


def test_normalize_story_text_strips_and_normalizes_newlines() -> None:
    raw = "  Hello\r\nworld.  \r\n\r\n"
    normalized = normalize_story_text(raw)
    assert normalized == "Hello\nworld."


def test_pack_token_sequences_adds_boundaries_and_drops_incomplete_tail() -> None:
    sequences = [[4, 5], [6]]
    packed = pack_token_sequences(
        sequences=sequences,
        sequence_length=3,
        bos_token_id=1,
        eos_token_id=2,
    )
    assert packed.shape == (1, 4)
    assert packed.tolist() == [[1, 4, 5, 2]]


def test_packed_token_dataset_returns_shifted_inputs_and_targets() -> None:
    packed = np.array([[1, 4, 5, 2]], dtype=np.int64)
    dataset = PackedTokenDataset(packed)
    input_ids, targets = dataset[0]
    assert isinstance(input_ids, torch.Tensor)
    assert isinstance(targets, torch.Tensor)
    assert input_ids.tolist() == [1, 4, 5]
    assert targets.tolist() == [4, 5, 2]
```

## 本章结束后你应该验证什么

先跑测试：

```bash
uv run pytest tests/data/test_pack.py
```

然后用一个小实验检查打包行为：

```bash
uv run python - <<'PY'
from phoenix_mini_llm.data.pack import pack_token_sequences

packed = pack_token_sequences([[4, 5], [6, 7]], sequence_length=3, bos_token_id=1, eos_token_id=2)
print(packed)
print(packed.shape)
PY
```

你至少应该能解释：

- 为什么输出每行长度是 `sequence_length + 1`。
- 为什么有些尾部 token 被丢弃。
- 为什么 `input_ids` / `targets` 只是同一行的错位切片。

## 常见偏差

### 偏差 1：把下载逻辑写成“先全部拉下来再截断”

对于流式数据集，这会让你失去节省内存的意义，也更难迁移到更大语料。

### 偏差 2：把 `pack_token_sequences()` 写成每条样本独立补零

当前项目不是 padding 风格的数据集，而是把多个序列展平后按训练块切分。这样更接近经典语言模型训练流程，也更省显存。

### 偏差 3：在 `Dataset.__getitem__()` 里返回 `numpy` 数组

后面训练循环直接使用 `torch.Tensor`，这里就应完成转换。

<Callout title="相关学习章节" tone="note">
  如果你对“为什么目标序列是左移一位”还不够牢，回到 [06. 语言模型训练目标](/learning/06-language-modeling-objective)。如果你对打包后的形状还没有直觉，回到 [04. 自动求导与训练闭环](/learning/04-autograd-and-training-loop)。
</Callout>

## 本章完成后的阶段检查点

```bash
git add .
git commit -m "tutorial-step-02"
```

## 下一章做什么

下一章会把这里的纯函数串起来：训练 BPE Tokenizer、对文本批量编码、写出 `tokenizer.json` 和 `prepare_metadata.json`，并通过 `phoenix-prepare-data` 一次性生成训练所需工件。
