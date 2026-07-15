---
title: 2. Tensor 与自动求导
group:
  title: 基础
  order: 0
order: 2
toc: content
---

# 2. Tensor 与自动求导

## Tensor 是什么

在 PyTorch 里，Tensor 可以简单理解成“带设备信息和梯度能力的多维数组”。对本项目来说，最常见的几类 Tensor 是：

- `input_ids`: `[batch, sequence]`
- `targets`: `[batch, sequence]`
- `logits`: `[batch, sequence, vocab]`
- `loss`: 标量

## 为什么形状思维很重要

LLM 项目最常见的 bug 不是“数学公式完全错了”，而是：

- 维度对不上
- transpose 顺序错了
- mask 广播方向错了
- cache 拼接位置错了

所以你读模型代码时，要先问自己：

1. 这个张量当前是什么形状？
2. 这一层之后会变成什么形状？
3. 它所在的维度分别代表 batch、head、time、channel 中的哪一个？

## 自动求导在训练里扮演什么角色

训练时的核心流程是：

1. 前向算出 `logits`
2. 用 `cross_entropy` 算出 `loss`
3. 调用 `loss.backward()`
4. 优化器根据梯度更新参数

你不需要手工推导每个参数的梯度，因为 PyTorch 的 autograd 会记录前向图并自动反传。

## 本项目里最值得关注的两种梯度相关操作

### 1. `optimizer.zero_grad(set_to_none=True)`

每次更新参数前清空旧梯度，防止本次梯度和上次梯度叠加。

### 2. `clip_grad_norm_`

用于抑制梯度爆炸。对小模型一样有用，尤其在你：

- 学习率偏大
- tokenizer 或数据异常
- batch 很小

时，梯度裁剪能减少训练突然发散。
