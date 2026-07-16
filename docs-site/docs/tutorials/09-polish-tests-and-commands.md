---
title: 09. 补齐工程化细节、测试与命令
group:
  title: 复刻教程
  order: 0
order: 8
toc: content
---

# 09. 补齐工程化细节、测试与命令

## 本章目标

这一章的重点不是再加新算法，而是把工程边缘补齐。完成后，你应该拥有：

- 清晰的设备检测和 AMP 上下文选择。
- 随机种子与日志初始化工具。
- `scripts/` 层包装入口。
- 覆盖数据、模型、训练、推理的完整测试矩阵。
- 一组稳定的日常命令：测试、训练、评估、生成。

## 本章对应的仓库文件

- `src/phoenix_mini_llm/utils/device.py`
- `src/phoenix_mini_llm/utils/randomness.py`
- `src/phoenix_mini_llm/utils/logging.py`
- `scripts/prepare_data.py`
- `scripts/train.py`
- `scripts/evaluate.py`
- `scripts/generate.py`
- `tests/**`

## 第一步：写设备与 AMP 工具

`src/phoenix_mini_llm/utils/device.py`：

```python
from __future__ import annotations

from contextlib import nullcontext

import torch


def detect_device() -> torch.device:
    if torch.cuda.is_available():
        return torch.device("cuda")

    if hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        return torch.device("mps")

    return torch.device("cpu")


def build_amp_context(device: torch.device, enabled: bool):
    if enabled and device.type == "cuda":
        return torch.autocast(device_type="cuda", dtype=torch.float16)
    return nullcontext()
```

### 为什么这里只对 CUDA 开 AMP

因为当前项目的跨平台策略是：

- Mac / MPS 阶段优先追求行为稳定。
- Windows / CUDA 正式训练阶段再追求混合精度收益。

不要在 MPS 上假装所有 AMP 路径都和 CUDA 等价。

## 第二步：写随机种子工具

`src/phoenix_mini_llm/utils/randomness.py`：

```python
from __future__ import annotations

import random

import numpy as np
import torch


def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
```

它不保证 Mac MPS 和 Windows CUDA 的每一步浮点结果完全一致，但能保证大体趋势和调试入口保持稳定。

## 第三步：写日志初始化

`src/phoenix_mini_llm/utils/logging.py`：

```python
from __future__ import annotations

import logging


def configure_logging() -> logging.Logger:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
    return logging.getLogger("phoenix-mini-llm")
```

日志工具保持简单，是因为这个项目的重点不是日志框架，而是让 prepare/train/evaluate/generate 四个入口有统一输出格式。

## 第四步：保留 `scripts/` 层包装

虽然 `pyproject.toml` 已经声明了四个 CLI 命令，但仓库里仍然保留：

- `scripts/prepare_data.py`
- `scripts/train.py`
- `scripts/evaluate.py`
- `scripts/generate.py`

每个文件都只做一件事：

```python
from phoenix_mini_llm.cli.train import main

if __name__ == "__main__":
    main()
```

这样做的意义是：

- 命令行入口和脚本入口共享同一套业务实现。
- 在 IDE、CI 或远程任务里都能快速调用。

## 第五步：把测试矩阵补齐

当前仓库的测试分成四层：

- `tests/data/`
- `tests/models/`
- `tests/training/`
- `tests/inference/`

这四层分别回答不同问题：

- 数据阶段的纯函数有没有写错。
- 模型 shape、因果性和 KV Cache 是否成立。
- 训练步、checkpoint 和恢复逻辑是否稳定。
- 采样与生成接口是否符合预期。

### 当前仓库里应该存在的测试文件

```text
tests/test_config.py
tests/data/test_tokenizer.py
tests/data/test_pack.py
tests/models/test_cache.py
tests/models/test_transformer.py
tests/training/test_checkpointing.py
tests/training/test_loop.py
tests/inference/test_sampling.py
tests/inference/test_generate.py
```

## 第六步：把日常命令固定下来

到这一章结束，你应该已经形成一组稳定工作流：

```bash
uv run pytest
uv run ruff check .
uv run pyright

uv run phoenix-prepare-data --config configs/debug.toml
uv run phoenix-train --config configs/debug.toml
uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
uv run phoenix-generate --config configs/debug.toml --checkpoint latest --prompt "Once upon a"
```

如果你每次都靠翻历史命令或临时拼脚本，说明工程入口还没真正固定。

## 本章结束后如何验证

至少跑一次完整静态与单元测试：

```bash
uv run pytest
uv run ruff check .
uv run pyright
```

全部通过后，再从 `scripts/` 层触发一遍训练或评估，确认包装入口也没有漂：

```bash
uv run python scripts/evaluate.py --config configs/debug.toml --checkpoint latest
```

## 常见偏差

### 偏差 1：只跑 `pytest`，不跑类型检查

这个项目里很多错误不是“运行时报错”，而是配置结构或张量接口的静态形状误用。`pyright` 能提前抓出一部分问题。

### 偏差 2：设备选择写死成 `.cuda()`

这会直接破坏 Mac 开发 / Windows 训练的跨平台路径。

### 偏差 3：脚本入口和 CLI 入口各写一套逻辑

一旦分叉，后续你修 bug 会修两遍，而且很容易漏掉一个入口。

> **相关踩坑**
>
>   如果你在 Mac 上能跑、到 Windows 上就出问题，先看 [05. MPS 与 CUDA 的精度差异](/pitfalls/05-mps-vs-cuda-and-amp.md)。

## 本章完成后的阶段检查点

```bash
git add .
git commit -m "tutorial-step-09"
```

## 下一章做什么

最后一章会把所有入口按 `debug` / `dev` / `train` 三套配置串起来，形成一份真正可复现当前仓库结果的操作手册。
