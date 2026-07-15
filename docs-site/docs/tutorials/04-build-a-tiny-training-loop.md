---
title: 04. 写最小训练闭环
group:
  title: 复刻教程
  order: 0
order: 3
toc: content
---

# 04. 写最小训练闭环

## 本章目标

这一章不追求“已经能训练完整 Transformer”，而是先把训练闭环本身写正确。完成后，你应该已经明确：

- 一个 batch 进入模型后，怎样得到 `loss`。
- `loss.backward()`、梯度裁剪、`optimizer.step()` 的顺序是什么。
- 评估阶段为什么必须显式关闭梯度。
- 训练循环里哪些逻辑应该写成可复用函数，而不是藏在脚本里。

这一章的产物会被后面完整模型直接复用，所以目标是把训练层接口定准。

## 本章对应的仓库文件

- `src/phoenix_mini_llm/training/loop.py`
- `tests/training/test_loop.py`

## 为什么这里先写“闭环”而不是先写完整模型

很多人会先把 Transformer 全写完，再开始思考怎么训练。结果往往是：

- 模型本身和训练逻辑同时出错，无法定位。
- 不清楚 loss 变 NaN 是 Attention 算错，还是训练步写错。
- 很多训练工程细节直到后期才发现自己没有抽象层。

正确顺序是：

1. 先明确训练层期望模型提供什么接口。
2. 把训练步和评估步写成稳定函数。
3. 再让模型去满足这个接口。

## 第一步：定义训练步的最小输入输出

当前项目把“训练一步”的输入压到最少：

- `model`
- `batch`
- `optimizer`
- `device`
- `gradient_clip_norm`
- `amp_enabled`

输出只保留两项：

- `loss`
- `grad_norm`

这就是 `TrainStepMetrics` 的职责：

```python
from dataclasses import dataclass


@dataclass(slots=True)
class TrainStepMetrics:
    loss: float
    grad_norm: float
```

## 第二步：实现 `run_train_step()`

这一章的关键函数如下：

```python
from __future__ import annotations

from contextlib import nullcontext
from dataclasses import dataclass

import torch
from torch import nn
from torch.optim import Optimizer


@dataclass(slots=True)
class TrainStepMetrics:
    loss: float
    grad_norm: float


def run_train_step(
    *,
    model: nn.Module,
    batch: tuple[torch.Tensor, torch.Tensor],
    optimizer: Optimizer,
    device: torch.device,
    gradient_clip_norm: float,
    amp_enabled: bool,
) -> TrainStepMetrics:
    model.train()
    optimizer.zero_grad(set_to_none=True)
    input_ids, targets = (tensor.to(device) for tensor in batch)
    autocast_context = (
        torch.autocast(device_type="cuda", dtype=torch.float16)
        if amp_enabled and device.type == "cuda"
        else nullcontext()
    )
    with autocast_context:
        output = model(input_ids=input_ids, targets=targets)
        if output.loss is None:
            raise RuntimeError("model output loss must not be None during training")
        loss = output.loss
    loss.backward()
    grad_norm = float(torch.nn.utils.clip_grad_norm_(model.parameters(), gradient_clip_norm))
    optimizer.step()
    return TrainStepMetrics(loss=float(loss.detach().cpu().item()), grad_norm=grad_norm)
```

### 这里的关键顺序不能写错

正确顺序是：

1. `model.train()`
2. `optimizer.zero_grad(set_to_none=True)`
3. batch 移到目标设备
4. 可选 `autocast`
5. 前向得到 `loss`
6. `loss.backward()`
7. `clip_grad_norm_`
8. `optimizer.step()`

如果你把 `zero_grad()` 放错位置，或者在 `optimizer.step()` 之前忘了 backward，训练结果会直接失真。

### 为什么这里不用 `GradScaler`

因为本章只实现最小训练步。`GradScaler` 会在第 7 章的正式训练循环里接上。这里先把单步逻辑写正确，否则混合精度只会增加噪音。

## 第三步：实现 `evaluate_batches()`

训练步和评估步最重要的差别不是“少写几行代码”，而是：

- 评估时必须 `model.eval()`
- 必须在 `torch.no_grad()` 下运行
- 必须累计平均 loss，而不是只看最后一个 batch

最终实现：

```python
def evaluate_batches(
    *,
    model: nn.Module,
    dataloader,
    device: torch.device,
    max_batches: int | None = None,
) -> float:
    model.eval()
    total_loss = 0.0
    count = 0
    with torch.no_grad():
        for batch_index, batch in enumerate(dataloader):
            if max_batches is not None and batch_index >= max_batches:
                break
            input_ids, targets = (tensor.to(device) for tensor in batch)
            output = model(input_ids=input_ids, targets=targets)
            if output.loss is None:
                raise RuntimeError("model output loss must not be None during evaluation")
            total_loss += float(output.loss.detach().cpu().item())
            count += 1
    if count == 0:
        raise ValueError("evaluation received zero batches")
    return total_loss / count
```

### 为什么现在就加 `max_batches`

因为在学习阶段和 debug 阶段，你经常只想快速抽查前几个 batch 是否数值正常。这个参数能显著缩短回归时间。

## 第四步：先为后续完整训练循环预留结构

当前仓库里的 `training/loop.py` 最终还会包含：

- `TrainSummary`
- `fit()`
- `_infinite_batches()`

这一章你可以先把 `run_train_step()` 与 `evaluate_batches()` 写好；第 7 章再把完整训练循环和 checkpoint 节奏补进来。

## 第五步：给训练步写测试

虽然完整模型还没拼出来，但你现在至少应该理解最终测试想验证什么。仓库里的 `tests/training/test_loop.py` 会在模型完成后验证这些事实：

- 一步训练能够返回有限 loss。
- 参数确实发生了更新。
- 评估函数返回平均 loss，而不是某个随机 batch 值。
- 完整训练循环能跑到指定 step，并保存 checkpoint。

这一章先把训练层代码写出来，等第 6 章模型拼好、第 7 章训练器补齐后，再让整套测试完全对齐仓库。

## 本章结束后你可以做的最小自检

如果你已经有一个临时 toy 模型，可以这样验证训练步接口是否成立：

```bash
uv run python - <<'PY'
import torch
from torch import nn

from phoenix_mini_llm.training.loop import run_train_step


class ToyOutput:
    def __init__(self, logits, loss):
        self.logits = logits
        self.loss = loss


class ToyModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.embedding = nn.Embedding(32, 16)
        self.head = nn.Linear(16, 32)

    def forward(self, input_ids, targets=None):
        logits = self.head(self.embedding(input_ids))
        loss = None
        if targets is not None:
            loss = torch.nn.functional.cross_entropy(
                logits.view(-1, logits.size(-1)),
                targets.view(-1),
            )
        return ToyOutput(logits=logits, loss=loss)


model = ToyModel()
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
batch = (torch.randint(0, 32, (2, 8)), torch.randint(0, 32, (2, 8)))
metrics = run_train_step(
    model=model,
    batch=batch,
    optimizer=optimizer,
    device=torch.device("cpu"),
    gradient_clip_norm=1.0,
    amp_enabled=False,
)
print(metrics)
PY
```

如果接口设计正确，这个脚本应该能跑完并打印一个有限的 `loss`。

## 常见偏差

### 偏差 1：把设备迁移放在模型外层调用者里，不在训练步里统一处理

这会导致不同入口脚本各自维护 `.to(device)` 逻辑，最后容易分叉。

### 偏差 2：评估阶段忘记 `torch.no_grad()`

这会让显存与内存占用明显增加，还可能让你误判性能问题。

### 偏差 3：训练步里把 AMP 逻辑写死到所有设备

当前项目的策略是：只有 CUDA 才默认走 `torch.autocast(..., dtype=torch.float16)`。Mac 的 MPS 不在这里直接假装完全等价。

<Callout title="相关学习章节" tone="note">
  如果你对反向传播、梯度、loss 的数值路径还不够稳定，回到 [04. 自动求导与训练闭环](/learning/04-autograd-and-training-loop)。
</Callout>

## 本章完成后的阶段检查点

```bash
git add .
git commit -m "tutorial-step-04"
```

## 下一章做什么

下一章开始写真正的模型砖块：RoPE、RMSNorm、SwiGLU、Causal Self-Attention 和 Transformer Block。到了那一步，训练闭环终于会和真实模型对接。
