---
title: 07. 写正式训练器与 Checkpoint 链路
group:
  title: 复刻教程
  order: 0
order: 6
toc: content
---

# 07. 写正式训练器与 Checkpoint 链路

## 本章目标

前几章你已经有了：

- 数据准备链路
- Tokenizer 工件与 metadata
- 完整模型
- 最小训练步与评估步

这一章要做的，是把这些组件组织成一条可恢复、可评估、可落盘的正式训练链路。完成后，你应该拥有：

- `AdamW` 优化器与带 warmup 的余弦调度器。
- 标准化的 checkpoint 保存 / 加载逻辑。
- 支持梯度累积、评估间隔、保存间隔的 `fit()`。
- `phoenix-train` 和 `phoenix-evaluate` 两个入口。

## 本章对应的仓库文件

- `src/phoenix_mini_llm/training/optim.py`
- `src/phoenix_mini_llm/training/checkpoints.py`
- `src/phoenix_mini_llm/training/loop.py`
- `src/phoenix_mini_llm/cli/train.py`
- `src/phoenix_mini_llm/cli/evaluate.py`
- `tests/training/test_checkpointing.py`
- `tests/training/test_loop.py`

## 第一步：写优化器与学习率调度器

当前项目使用最朴素、也最适合学习项目的组合：

- `AdamW`
- warmup + cosine decay

`src/phoenix_mini_llm/training/optim.py` 的完整实现：

```python
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
```

### 为什么调度器这样设计

- warmup 让训练初期更平稳。
- cosine decay 是足够简单又常见的学习率退火方式。
- 下限不是 0，而是 `0.1 + 0.9 * cosine`，避免后期学习率衰减得过猛。

## 第二步：写 checkpoint 保存 / 加载逻辑

`src/phoenix_mini_llm/training/checkpoints.py`：

```python
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import torch
from torch import nn
from torch.optim import Optimizer
from torch.optim.lr_scheduler import LRScheduler


@dataclass(slots=True)
class CheckpointState:
    step: int
    metadata: dict[str, Any]


def save_checkpoint(
    path: str | Path,
    *,
    model: nn.Module,
    optimizer: Optimizer,
    scheduler: LRScheduler | None = None,
    step: int,
    metadata: dict[str, Any] | None = None,
) -> None:
    checkpoint_path = Path(path)
    checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {
            "model": model.state_dict(),
            "optimizer": optimizer.state_dict(),
            "scheduler": None if scheduler is None else scheduler.state_dict(),
            "step": step,
            "metadata": metadata or {},
        },
        checkpoint_path,
    )


def load_checkpoint(
    path: str | Path,
    *,
    model: nn.Module,
    optimizer: Optimizer,
    scheduler: LRScheduler | None = None,
    device: torch.device,
) -> CheckpointState:
    checkpoint = torch.load(Path(path), map_location=device)
    model.load_state_dict(checkpoint["model"])
    optimizer.load_state_dict(checkpoint["optimizer"])
    if scheduler is not None and checkpoint.get("scheduler") is not None:
        scheduler.load_state_dict(checkpoint["scheduler"])
    return CheckpointState(step=int(checkpoint["step"]), metadata=dict(checkpoint["metadata"]))
```

### 这里的约束很重要

- 保存的是 `state_dict`，不是整个模型对象。
- 加载时总是使用 `map_location=device`。
- `scheduler` 是可选的，但如果存在就一起恢复。

## 第三步：把 `fit()` 补完整

前面第 4 章只写了最小训练步，这一章补齐完整训练循环。核心职责是：

- 支持梯度累积。
- 支持 AMP + `GradScaler`。
- 定期评估。
- 定期保存 checkpoint。
- 训练结束后返回汇总信息。

当前项目里的关键实现如下：

```python
@dataclass(slots=True)
class TrainSummary:
    step: int
    last_train_loss: float
    best_eval_loss: float


def fit(
    *,
    model: nn.Module,
    train_dataloader,
    val_dataloader,
    optimizer: Optimizer,
    scheduler: LRScheduler | None,
    training_config: TrainingConfig,
    device: torch.device,
    checkpoint_dir,
    start_step: int = 0,
) -> TrainSummary:
    model.to(device)
    scaler = torch.amp.GradScaler(
        device.type,
        enabled=training_config.amp and device.type == "cuda",
    )
    train_iterator = _infinite_batches(train_dataloader)
    best_eval_loss = float("inf")
    last_train_loss = 0.0

    for step in range(start_step + 1, training_config.max_steps + 1):
        model.train()
        optimizer.zero_grad(set_to_none=True)
        accumulated_loss = 0.0

        for _ in range(training_config.gradient_accumulation_steps):
            input_ids, targets = (tensor.to(device) for tensor in next(train_iterator))
            autocast_context = (
                torch.autocast(device_type="cuda", dtype=torch.float16)
                if training_config.amp and device.type == "cuda"
                else nullcontext()
            )
            with autocast_context:
                output = model(input_ids=input_ids, targets=targets)
                if output.loss is None:
                    raise RuntimeError("model output loss must not be None during training")
                loss = output.loss / training_config.gradient_accumulation_steps

            accumulated_loss += float(output.loss.detach().cpu().item())
            scaler.scale(loss).backward()

        scaler.unscale_(optimizer)
        torch.nn.utils.clip_grad_norm_(model.parameters(), training_config.gradient_clip_norm)
        scaler.step(optimizer)
        scaler.update()
        if scheduler is not None:
            scheduler.step()

        last_train_loss = accumulated_loss / training_config.gradient_accumulation_steps

        should_evaluate = (
            step % training_config.eval_interval == 0
            or step == training_config.max_steps
        )
        eval_loss = best_eval_loss
        if should_evaluate:
            eval_loss = evaluate_batches(model=model, dataloader=val_dataloader, device=device)
            best_eval_loss = min(best_eval_loss, eval_loss)

        should_save = step % training_config.save_interval == 0 or step == training_config.max_steps
        if should_save:
            save_checkpoint(
                Path(checkpoint_dir) / f"step-{step:06d}.pt",
                model=model,
                optimizer=optimizer,
                scheduler=scheduler,
                step=step,
                metadata={"eval_loss": eval_loss},
            )

    return TrainSummary(
        step=training_config.max_steps,
        last_train_loss=last_train_loss,
        best_eval_loss=best_eval_loss,
    )
```

### 这里最关键的工程点

- 梯度累积时，反向传播的 loss 要先除以 `gradient_accumulation_steps`。
- 统计展示用的 `accumulated_loss` 仍然累计原始 `output.loss`，最后再取平均。
- `GradScaler` 只在 CUDA + `amp=true` 时启用。
- 评估与保存都在间隔条件和最后一步强制执行。

## 第四步：写 `cli/train.py`

训练入口必须负责这些事：

1. 读取 TOML 配置。
2. 读取 `prepare_metadata.json` 并回填真实词表信息。
3. 选择设备并设置随机种子。
4. 加载 `train.npy` / `validation.npy`。
5. 构造模型、优化器、调度器。
6. 可选地从 checkpoint 恢复。
7. 调用 `fit()` 并把汇总结果写入 `runs/<run_name>/train_summary.json`。

这一步不要偷懒把逻辑拆到脚本根目录里。当前仓库专门使用 `src/phoenix_mini_llm/cli/train.py` 维持可测试入口。

## 第五步：写 `cli/evaluate.py`

评估入口的职责更简单：

- 读配置
- 应用 metadata
- 加载验证集
- 构建模型 / 优化器 / 调度器
- 加载 checkpoint
- 调用 `evaluate_batches()`
- 输出 JSON 结果

最终你会得到类似：

```json
{
  "checkpoint": "checkpoints/debug/step-000020.pt",
  "step": 20,
  "validation_loss": 6.21
}
```

## 第六步：用测试锁住训练链路

`tests/training/test_checkpointing.py` 应该验证 checkpoint 往返恢复：

- 模型参数能恢复
- optimizer 状态能恢复
- scheduler 的 epoch 指针能恢复

`tests/training/test_loop.py` 应该验证：

- `run_train_step()` 返回有限 loss 且参数被更新
- `evaluate_batches()` 返回平均 loss
- `fit()` 能写出 checkpoint
- `fit()` 支持从已有 step 继续

## 本章结束后你应该怎么跑

先跑训练层测试：

```bash
uv run pytest tests/training/test_checkpointing.py tests/training/test_loop.py
```

然后执行一轮最小训练：

```bash
uv run phoenix-train --config configs/debug.toml
```

训练成功后，你至少应该看到：

```text
checkpoints/debug/step-000010.pt
checkpoints/debug/step-000020.pt
runs/debug/train_summary.json
```

再试一次评估：

```bash
uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
```

## 常见偏差

### 偏差 1：恢复 checkpoint 时没把 optimizer / scheduler 一起加载

这样表面上能继续训练，实际上学习率节奏已经错了。

### 偏差 2：梯度累积时忘记对 loss 除以累积步数

这会让实际有效学习率被无意放大。

### 偏差 3：在训练入口里忘记 `apply_prepare_metadata()`

如果真实 tokenizer 词表大小和配置值不一致，模型 embedding 维度会直接错。

<Callout title="相关学习章节" tone="note">
  如果你对学习率 warmup、梯度累积和 checkpoint 的意义还不够稳，回到 [10. 训练工程](/learning/10-training-engineering)。
</Callout>

## 本章完成后的阶段检查点

```bash
git add .
git commit -m "tutorial-step-07"
```

## 下一章做什么

下一章会把训练好的 checkpoint 真正拿来生成文本：实现 top-k / top-p 采样，自回归循环，以及 `phoenix-generate` 入口。
