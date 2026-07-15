---
title: 04. 写最小训练闭环
group:
  title: 复刻教程
  order: 0
order: 3
toc: content
---

import { Callout } from '../../src/components/Callout';

# 04. 写最小训练闭环

## 本章目标

先不要急着写完整 Transformer。你需要先证明“训练这件事”在你的项目里是通的。完成本章之后，你应该能让一个极小模型在玩具数据上 overfit。

## 你将新增或修改哪些文件

```text
src/phoenix_mini_llm/training/loop.py
src/phoenix_mini_llm/training/optim.py
tests/training/test_loop.py
```

## 推荐实现顺序

1. 先写一个最小的 `run_train_step()`。
2. 用一个极简模型和伪造 batch 让测试先跑通。
3. 再扩展到能循环多个 step 的 `fit()`。

## 为什么不能跳过这一步

如果你直接在完整 Transformer 上调训练脚本，一旦损失不降，你很难判断问题到底来自：

- 模型结构
- loss 构造
- optimizer
- 数据
- 设备移动

而一个能 overfit 玩具样本的最小训练闭环，相当于给后面的复杂模型做了一次基线验收。

## 关键函数轮廓

```python
def run_train_step(
    *,
    model,
    batch,
    optimizer,
    device,
    gradient_clip_norm,
    amp_enabled,
) -> TrainStepMetrics:
    ...
```

## 关键点

### 1. 先保证单步训练是正确的

单步训练至少要包括：

- `model.train()`
- `optimizer.zero_grad()`
- loss 前向
- `loss.backward()`
- 梯度裁剪
- `optimizer.step()`

### 2. 训练步测试要检查“参数真的变了”

比起只检查函数没报错，更有价值的是检查：

- loss 是数字
- 梯度范数可读
- 参数经过 step 后与之前不一样

### 3. 先不追求完整工程化

这一章的目标不是 checkpoint、评估和恢复，而是让你先拿到一条确定可用的训练主干。

## 常见错误

- 把 `optimizer.zero_grad()` 放错位置。
- loss 没有参与 backward。
- 训练测试只检查函数返回值，不检查参数是否真的更新。

<Callout title="相关学习章节" tone="note">
  如果你对 `loss.backward()` 和 `optimizer.step()` 的分工还不牢，回看 [04. 自动求导与训练闭环](/learning/04-autograd-and-training-loop)。
</Callout>

## 本章完成后如何检查

1. 你能在测试里构造一个最小模型和 batch。
2. `run_train_step()` 调用后参数会更新。
3. `tests/training/test_loop.py` 能证明单步训练有效。

## 建议本地检查点名称

`tutorial-step-04`
