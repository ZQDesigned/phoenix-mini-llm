---
title: 06. 语言模型训练目标
group:
  title: 学习主线
  order: 0
order: 5
toc: content
---

import { Callout } from '../../src/components/Callout';

# 06. 语言模型训练目标

## 这一章要解决什么问题

你已经知道文本会变成 token 序列，也知道训练要通过损失函数更新参数。现在要把这两件事接起来：语言模型到底如何从一段 token 序列构造输入与目标？

## 你需要先知道什么

- 理解 token 打包过程。
- 理解前向传播、损失和反向传播的基本关系。

## 核心概念

### 1. 输入和目标是同一段序列的错位版本

假设你有一段 token 序列：

```text
[BOS, A, B, C, EOS]
```

训练时常见的处理方式是：

- 输入：`[BOS, A, B, C]`
- 目标：`[A, B, C, EOS]`

这样模型在每个位置都要回答：“根据前面这些 token，下一位最可能是什么？”

### 2. teacher forcing 让训练比推理更稳定

训练时，即使模型在某一步预测错了，下一步输入仍然使用真实 token，而不是模型刚才猜错的输出。这种做法叫 teacher forcing。

它的好处是：

- 训练更稳定
- 梯度信号更清晰
- 模型能在整条真实序列上学习统计关系

### 3. logits 不是概率

模型输出通常是一组 logits，它们是未经归一化的分数。只有经过 softmax 之后，才会变成概率分布。

但训练时通常不会手动写 softmax 再写对数损失，而是直接把 logits 交给 cross-entropy，因为框架内部会更稳定地完成这些计算。

### 4. causal mask 的作用是防止偷看未来

如果你让模型在预测第 `t` 个位置时看见第 `t+1` 个位置的真实 token，那训练就失去意义了。

因此 decoder-only 模型必须保证：

- 每个位置只能看见自己以及自己之前的 token
- 不能看见未来位置

这个约束通常通过 causal mask 实现。

## 最小必要数学

对一个长度为 `T` 的序列，语言模型的训练目标可以写成：

\[
\sum_{t=1}^{T} -\log P(x_t \mid x_{<t})
\]

这句话的意思是：把序列中每个位置的“正确 token 对数概率”累加起来，概率越低，损失越大。

## 最小代码实验

```python
import torch
import torch.nn.functional as F

logits = torch.tensor([
    [[2.0, 0.5, -1.0], [0.1, 1.8, 0.2]]
])  # [batch=1, seq=2, vocab=3]

targets = torch.tensor([[0, 1]])

loss = F.cross_entropy(
    logits.view(-1, logits.size(-1)),
    targets.view(-1),
)

print(loss)
```

这里有两个关键点：

1. `logits` 的最后一维是词表大小。
2. cross-entropy 比较的是“每个位置的词表分布”和“该位置正确 token 的 id”。

## 常见误区

### 误区 1：训练目标是在预测“整句话”

不是。训练目标是对每个位置分别预测下一个 token。整句话只是很多局部预测串起来的结果。

### 误区 2：目标序列要和输入完全相同

如果输入和目标完全相同，模型就不是在学“下一个 token”，而是在学“当前位置自己是什么”，这会让任务定义出错。

### 误区 3：只要有 cross-entropy 就够了，不需要 mask

如果没有 causal mask，模型就能偷看未来 token，训练结果会看似很好，但推理时立刻失效，因为真实生成阶段根本看不到未来。

<Callout title="这一章的工程后果" tone="warning">
  一旦你把序列右移逻辑、target 构造或 mask 写错，模型往往还能继续训练，但损失含义已经变了。这样的 bug 很隐蔽，必须靠 shape 检查、过拟合小样本和单元测试一起抓。
</Callout>

## 练习题

1. 为什么输入和目标要整体错开一位？
2. teacher forcing 为什么能让训练比“完全自回归滚动输入”更稳定？
3. 如果没有 causal mask，训练得到的低损失为什么不可信？

## 下一章会用到什么

下一章会回答一个更结构性的问题：如果模型只能不断做“下一个 token 预测”，那它为什么需要 Attention，而不是普通 MLP 就够了？
