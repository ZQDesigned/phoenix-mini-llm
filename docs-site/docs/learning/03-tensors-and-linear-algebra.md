---
title: 03. Tensor 与线性代数直觉
group:
  title: 学习主线
  order: 0
order: 2
toc: content
---

# 03. Tensor 与线性代数直觉

## 这一章要解决什么问题

如果你看到这些形状就开始发懵：

- `input_ids.shape == [batch, seq]`
- `hidden.shape == [batch, seq, hidden]`
- `logits.shape == [batch, seq, vocab]`

那么后面几乎所有模型代码都会显得非常抽象。你也许能机械地跟着抄写，但你不会真正知道每一维在表示什么，更无法在 shape 出错时快速定位问题。

这一章的目标非常务实：

> 把语言模型里最常见的 tensor 形状、查表操作、线性变换和矩阵乘法直觉讲清楚，让你看到一段张量代码时，脑子里能自动浮现它在操作什么结构。

你不需要成为线性代数专家，但你必须和 shape 建立稳定关系。

## 第一件事：tensor 并不神秘，它只是“带 shape 的数字容器”

在 PyTorch 里，`torch.Tensor` 本质上可以理解为一个多维数组。真正重要的不是“它用了什么底层实现”，而是：

> 你必须始终知道每一维代表什么含义。

例如在语言模型代码里，你最常看到的几种形状是：

- `input_ids`: `[batch, seq]`
- embedding 后的隐藏状态: `[batch, seq, hidden]`
- logits: `[batch, seq, vocab]`

如果你只是把这些数字当作“二维、三维、三维”，那还不够。你必须进一步理解：

- `batch` 表示同时处理多少条样本
- `seq` 表示每条样本的 token 长度
- `hidden` 表示每个 token 的向量表示宽度
- `vocab` 表示词表大小

一旦这个映射建立起来，很多模型代码会突然变得可读。

## 第二件事：为什么语言模型几乎总在处理“很多 token 的很多向量”

语言模型不是在处理单个数字，也不是在处理孤立单词。它通常在处理这样的结构：

1. 一次送进来多条样本
2. 每条样本包含一串 token
3. 每个 token 又会被映射成一个高维向量

这就是为什么三维张量在语言模型里如此常见：

\[
[\text{batch}, \text{seq}, \text{hidden}]
\]

### 可以把它想成什么

你可以把这个张量想成一个“批量的句子向量板”：

- 最外层是一批样本
- 每个样本里按顺序排着 token
- 每个 token 位置上放着一个向量

这样理解之后，三维 tensor 就不再是陌生对象，而只是“把很多向量按批和按序排起来”。

## 第三件事：batch 维度到底在帮你做什么

`batch` 的存在，是为了并行处理多条样本。

例如：

```text
batch_size = 4
```

表示模型一次会同时处理 4 条序列。

### 为什么要这么做

因为现代硬件，尤其 GPU，擅长并行计算。如果一次只处理一条样本，通常利用率会更低。

### batch 变大会带来什么

- 训练吞吐量可能提升
- 显存占用也会上升
- 梯度估计通常更平滑

所以 batch 不是单纯“越大越好”的参数，它和显存预算、训练稳定性、数据打包方式都紧密相关。

## 第四件事：sequence 维度为什么比看上去更重要

`seq` 表示每条样本中包含多少个 token。

它经常和这些词互换出现：

- sequence length
- context length
- max sequence length

### 为什么这不是一个普通长度参数

因为它会同时影响：

- 你如何打包训练数据
- attention 计算的成本
- 激活值大小
- 推理时单次可见上下文范围

对小型语言模型学习项目来说，`seq` 往往比很多人一开始想象中更关键。因为它直接和“能否在有限显存上训练”挂钩。

## 第五件事：hidden 维度在表示什么

`hidden` 表示每个 token 的连续向量表示长度。

例如：

```text
hidden_size = 384
```

意味着每个 token 在进入模型后，会被表示成一个 384 维向量。

### 为什么不能只用一个数字表示 token

因为语言模型需要表达的不是“这个 token 的编号”，而是与它相关的丰富统计关系，例如：

- 它和哪些其他 token 常一起出现
- 在哪些上下文里语义接近
- 它在当前序列中的作用是什么

单个标量不够承载这种信息，所以模型会把 token 映射到高维空间中。

## 第六件事：embedding 本质上是查表，不是魔法

这是理解模型前向最重要的直觉之一。

### embedding 层的参数长什么样

通常它是一张矩阵：

\[
[vocab\_size, hidden\_size]
\]

可以把它想成一本词表字典：

- 每一行对应一个 token id
- 每一列对应这个 token 表示中的一个维度

### 当前向里输入某个 token id 时发生了什么

如果 token id 是 `17`，embedding 做的事情不是复杂推理，而是：

> 从这张矩阵里取出第 17 行作为该 token 的向量表示。

这就是为什么人们常说 embedding 像“查表”。

### 一个最小例子

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

这里发生的事非常关键：

1. `input_ids` 是离散 token 编号
2. `embedding_table[input_ids]` 为每个 id 取出一行向量
3. 所以输出自然变成 `[batch, seq, hidden]`

一旦你把这个机制看懂，后面看到 `nn.Embedding` 就不会再把它当成黑箱。

## 第七件事：线性层通常只改最后一维

这也是非常重要的直觉。

假设你有：

\[
[batch, seq, hidden]
\]

然后接一个线性层，把 `hidden` 映射到另一个维度，例如 `out_dim`。那结果通常会变成：

\[
[batch, seq, out\_dim]
\]

也就是说：

- `batch` 不变
- `seq` 不变
- 最后一维被投影到新空间

### 为什么是这样

因为线性层本质上是在对“最后一维的向量”做变换，而不是在打乱 batch 或时间顺序。

例如：

```python
projection = torch.nn.Linear(hidden_size, 6)
out = projection(hidden)
print(out.shape)  # [2, 3, 6]
```

这背后的含义是：每个 token 的向量都被独立投影了一次，但 token 的位置和 batch 结构没有改变。

## 第八件事：矩阵乘法为什么在这里这么重要

虽然你不需要一开始就会做复杂推导，但你必须掌握一个最基本的判断：

> 每次看到线性层或 attention 里的乘法，都先看维度能不能对上。

### 最基本的矩阵乘法关系

如果：

\[
A \in \mathbb{R}^{m \times n}, \quad B \in \mathbb{R}^{n \times p}
\]

那么：

\[
AB \in \mathbb{R}^{m \times p}
\]

在语言模型里，这个判断会不断出现，例如：

- hidden state 乘投影矩阵
- query 与 key 转置做点积
- attention 权重再去乘 value

你不需要现在就把每个公式记住，但必须建立一种条件反射：

> 不看维度的乘法，是最危险的模型代码阅读方式之一。

## 第九件事：shape 为什么是调试信息，而不只是打印信息

很多初学者会打印 shape，但并没有真的“读 shape”。例如看到：

```text
torch.Size([8, 256, 384])
```

却不知道它对应的是：

- `8` 条样本
- 每条 `256` 个 token
- 每个 token 一个 `384` 维向量

### 为什么这件事如此关键

因为语言模型里很多 bug 并不会直接报错，而是会变成：

- 广播方式错了但还能运行
- reshape 顺序错了但还能运行
- 维度含义错位但损失仍然会下降一些

这种 bug 特别隐蔽。真正帮助你发现它们的，往往就是你能不能在每一步清楚说出：

- 输入 shape 是什么
- 输出 shape 是什么
- 每一维分别表示什么

<Callout title="接下来必须形成的习惯" tone="success">
  从现在开始，每读一个模块，都先写下输入 shape 和输出 shape。只要这个习惯建立起来，embedding、attention、logits、loss 这些结构就会比你想象中清晰得多。
</Callout>

## 一个更完整的最小实验

下面这段代码把“token id -> embedding -> 线性投影”串在一起：

```python
import torch

batch_size = 2
seq_len = 3
vocab_size = 12
hidden_size = 4
out_dim = 6

input_ids = torch.tensor([[1, 2, 3], [4, 5, 6]])
embedding = torch.nn.Embedding(vocab_size, hidden_size)
projection = torch.nn.Linear(hidden_size, out_dim)

hidden = embedding(input_ids)
logits = projection(hidden)

print("input_ids:", input_ids.shape)
print("hidden:", hidden.shape)
print("logits:", logits.shape)
```

你应该能从输出直接读出这条路径：

```text
[batch, seq]
-> [batch, seq, hidden]
-> [batch, seq, out_dim]
```

如果这条路径现在对你已经很自然，那么后面进入模型拼装章节会轻松很多。

## 三个最常见的误区

### 误区 1：只要代码能跑，shape 就不重要

这是非常危险的想法。很多 shape 错误不会立刻让程序崩掉，但会让模型学错东西，而且这种错误后果往往要在更后面才显现出来。

### 误区 2：embedding 就是 one-hot

one-hot 可以帮助你建立最初概念，但真实训练时更常见的是直接通过 embedding 矩阵查表。它更高效，也更符合现代语言模型做法。

### 误区 3：看到三维 tensor 就觉得它一定很难

三维 tensor 并没有引入新的神秘数学。它只是“很多 token 向量按顺序排成样本，再把很多样本按 batch 堆起来”。

## 这一章结束时，你应该能做到什么

如果你真的理解了这一章，那么你现在应该能：

1. 解释 `[batch, seq, hidden]` 中每一维的含义。
2. 看懂 embedding 为什么会把 `[batch, seq]` 变成 `[batch, seq, hidden]`。
3. 解释为什么线性层通常只改变最后一维。
4. 在看到一段 tensor 代码时，主动检查它的 shape 流动。

## 练习题

1. 如果 `input_ids.shape == [8, 256]`，而 `hidden_size = 384`，embedding 输出 shape 是多少？
2. 为什么线性层通常只改变最后一维，而不改变 batch 和 seq？
3. 如果你把 `[batch, seq, hidden]` 错看成 `[seq, batch, hidden]`，最可能引发什么问题？
4. 为什么说 shape 是语言模型里最重要的调试信息之一？

## 下一章会用到什么

下一章会把 tensor 从“存数据的容器”推进到“会参与梯度传播的计算图节点”。到那时你会看到：前向、损失、反向、参数更新到底怎样连成训练闭环。
