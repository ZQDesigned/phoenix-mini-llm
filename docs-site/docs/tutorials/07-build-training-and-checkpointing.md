---
title: 07. 写正式训练器与 Checkpoint 链路
group:
  title: 复刻教程
  order: 0
order: 6
toc: content
---

import { Callout } from '../../src/components/Callout';

# 07. 写正式训练器与 Checkpoint 链路

## 本章目标

把之前的最小训练闭环升级成完整训练器：支持 DataLoader、梯度累积、AMP 条件启用、定期评估、checkpoint 保存和恢复。完成后你应该可以真正开始训练这个项目。

## 你将新增或修改哪些文件

```text
src/phoenix_mini_llm/training/checkpoints.py
src/phoenix_mini_llm/training/optim.py
src/phoenix_mini_llm/training/loop.py
src/phoenix_mini_llm/cli/train.py
src/phoenix_mini_llm/cli/evaluate.py
tests/training/test_checkpointing.py
tests/training/test_loop.py
```

## 推荐实现顺序

1. 先写 checkpoint 保存与加载。
2. 再把优化器与 scheduler 构建封装出来。
3. 扩展 `fit()` 支持梯度累积与评估。
4. 最后再写 CLI，把配置、数据、模型和训练器串起来。

## 关键实现解释

### 1. 为什么先写 checkpoint

因为一旦训练真正跑起来，你最不想遇到的事情就是：

- 跑到一半中断
- 没法恢复
- 不知道哪份权重对应哪次实验

### 2. 梯度累积如何进入正式训练器

最常见的做法是：

1. 在一个外层 step 中循环若干 micro-batch
2. 每个 micro-batch 的 loss 除以累积步数
3. backward 多次后统一 step

### 3. AMP 只在 CUDA 条件启用

在这个项目里，不要假设 MPS 和 CUDA 有同样的精度行为。工程上更稳妥的方式是：

- 只有 `device.type == "cuda"` 时才启用混合精度
- 非 CUDA 路径默认走更安全的普通浮点训练

## 关键 CLI 结构

你最终要能稳定执行：

```bash
uv run phoenix-train --config configs/debug.toml
uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
```

这要求 `train.py` 和 `evaluate.py` 都能：

- 读取 TOML 配置
- 构建模型与数据
- 正确选择设备
- 处理 checkpoint 路径

## 常见错误

- 训练循环里只有训练损失，没有验证集评估。
- 保存 checkpoint 时只存模型参数，不存优化器状态。
- AMP 在非 CUDA 设备上也被强开。

<Callout title="相关踩坑" tone="warning">
  涉及设备抽象、混合精度和跨平台时，优先看 [05. MPS 与 CUDA 的精度差异](/pitfalls/05-mps-vs-cuda-and-amp)。
</Callout>

## 本章完成后如何检查

1. `tests/training/test_checkpointing.py` 能验证 round-trip。
2. `tests/training/test_loop.py` 能覆盖最小训练与评估流程。
3. 你能成功执行一次 debug 配置训练并生成 checkpoint。

## 建议本地检查点名称

`tutorial-step-07`
