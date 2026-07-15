---
title: 03. Tensor 与线性代数直觉
group:
  title: 学习主线
  order: 0
order: 2
toc: content
---

import { Callout } from '../../src/components/Callout';

# 03. Tensor 与线性代数直觉

## 这一章要解决什么问题

如果你看见 `input_ids.shape == [batch, seq]`、`hidden.shape == [batch, seq, hidden]` 就开始晕，那么后面的 embedding、attention 和 loss 都很难真正读懂。

这一章只做一件事：把语言模型里最常见的 tensor 形状和矩阵操作讲明白。你不需要变成线性代数专家，但你必须看到 shape 时知道“它在表示什么维度”。

## 你需要先知道什么

- 会写基本 Python。
- 已经读过前两章。

## 核心概念

### 1. tensor 只是“带 shape 的数字容器”

`torch.Tensor` 可以理解成一个多维数组。关键不是它神秘，而是你必须始终知道每一维代表什么。

在这个项目里最常见的几种形状是：

- `input_ids`: `[batch, seq]`
- token embedding 后的隐藏状态: `[batch, seq, hidden]`
- logits: `[batch, seq, vocab]`

### 2. batch 维度表示“同时处理多少条样本”

如果 `batch_size = 4`，那模型一次就会并行处理 4 条序列。这样可以提高 GPU 利用率，但也会增加显存占用。

### 3. sequence 维度表示“每条序列的长度”

在语言模型里，这一维通常就是上下文长度。`seq = 256` 表示每个样本最多给模型 256 个 token。

### 4. hidden 维度表示“每个 token 的向量表示长度”

一个 token 不会被表示成单个数，而会被映射成一个向量。例如 `hidden_size = 384` 时，每个 token 会被表示成 384 维向量。

### 5. embedding 本质上是“查表”

embedding 层的权重矩阵形状通常是：

\[
[vocab\_size, hidden\_size]
\]

如果某个 token 的 id 是 `17`，embedding 层做的就是取出这张表第 `17` 行对应的向量。

## 最小必要数学

### 矩阵乘法

如果：

\[
A \in \mathbb{R}^{m \times n}, \quad B \in \mathbb{R}^{n \times p}
\]

那么：

\[
A B \in \mathbb{R}^{m \times p}
\]

你不需要死记公式，但要养成这个习惯：

> 每次看到线性层或注意力计算，都先检查输入维度能不能对上。

## 最小代码实验

```python
import torch

batch_size = 2
seq_len = 3
vocab_size = 10
hidden_size = 4

input_ids = torch.tensor([[1, 2, 3], [4, 5, 6]])
embedding_table = torch.randn(vocab_size, hidden_size)

hidden = embedding_table[input_ids]

print("input_ids shape:", input_ids.shape)  # [2, 3]
print("hidden shape:", hidden.shape)        # [2, 3, 4]
```

这个例子里发生的事很重要：

1. `input_ids` 里存的是离散 token id。
2. `embedding_table[input_ids]` 把每个 id 映射成一个向量。
3. 结果自然就变成 `[batch, seq, hidden]`。

再看一个线性层：

```python
projection = torch.nn.Linear(hidden_size, 6)
out = projection(hidden)
print(out.shape)  # [2, 3, 6]
```

线性层只改最后一维，其余维度保持不变。

## 常见误区

### 误区 1：只要代码能跑，shape 不重要

shape 是语言模型里最重要的调试信息之一。很多 bug 并不会直接报错，而是因为广播或 reshape 方式不对，让模型“能跑但学错了”。

### 误区 2：embedding 是“把 token 变成 one-hot”

one-hot 可以作为概念起点，但实际训练中更常见的是直接用 embedding 矩阵查表。它更紧凑，也更适合学习连续表示。

### 误区 3：看见三维 tensor 就觉得难

其实 `[batch, seq, hidden]` 只是“很多 token 向量按序排起来，再按批堆起来”。它不是新的数学对象，只是维度更多的数组。

<Callout title="接下来你需要形成的习惯" tone="success">
  之后每读到一个模块，都先写下输入 shape 和输出 shape。只要这个习惯建立起来，模型代码会比你想象中清晰得多。
</Callout>

## 练习题

1. 如果 `input_ids.shape == [8, 256]`，而 embedding 后 `hidden_size = 384`，输出 shape 是多少？
2. 为什么线性层通常只改变最后一维？
3. 如果你把 `[batch, seq, hidden]` 错当成 `[seq, batch, hidden]`，最可能引发什么类型的问题？

## 下一章会用到什么

下一章会讲自动求导和训练闭环。到时候你会看到：tensor 不只是存数据，它还会沿着计算图传播梯度。
