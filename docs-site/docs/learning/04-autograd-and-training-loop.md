---
title: 04. 自动求导与训练闭环
group:
  title: 学习主线
  order: 0
order: 3
toc: content
---

# 04. 自动求导与训练闭环

## 这一章要解决什么问题

到目前为止，你已经知道模型在做“下一个 token 预测”，也知道 tensor 和 shape 长什么样。但真正让模型“从不会到会”的，是训练闭环：

1. 前向计算
2. 计算损失
3. 反向传播
4. 参数更新

如果你不理解这四步，训练脚本在你眼里就只是一堆固定写法。

## 你需要先知道什么

- 已理解 tensor、shape 和线性层。
- 知道模型参数是可调数字。

## 核心概念

### 1. 前向传播是在“给出当前答案”

前向传播就是把输入送进模型，得到当前参数下的输出。例如：

- 输入：一批 token id
- 输出：每个位置对下一个 token 的 logits

此时模型还没有“学习”，它只是根据当前参数作答。

### 2. 损失函数是在“量化这次答得有多差”

语言模型常用的损失是 cross-entropy。它会比较：

- 模型给出的 logits
- 正确的目标 token

如果模型把正确 token 的概率压得很低，损失就大；反之损失就小。

### 3. 反向传播是在“告诉每个参数该朝哪里改”

`loss.backward()` 的作用不是直接更新参数，而是：

- 沿计算图回传梯度
- 把每个参数对损失的影响记录在 `.grad` 里

梯度的符号和大小，决定了参数下一步该怎么调。

### 4. 优化器才真正负责“改参数”

常见写法是：

```python
optimizer.zero_grad()
loss.backward()
optimizer.step()
```

含义分别是：

- 清空上一次的梯度
- 为当前损失计算梯度
- 根据梯度更新参数

## 最小必要数学

一个参数更新的简化形式可以写成：

\[
\theta \leftarrow \theta - \eta \nabla_\theta L
\]

其中：

- \(\theta\) 是参数
- \(\eta\) 是学习率
- \(L\) 是损失
- \(\nabla_\theta L\) 是参数关于损失的梯度

你现在不需要推导它，只要理解：

> 梯度告诉你“往哪里调会让损失下降”，学习率告诉你“每次调多大”。

## 最小代码实验

```python
import torch

x = torch.tensor([[1.0]])
y = torch.tensor([[2.0]])

linear = torch.nn.Linear(1, 1)
optimizer = torch.optim.SGD(linear.parameters(), lr=0.1)

for step in range(5):
    optimizer.zero_grad()
    pred = linear(x)
    loss = torch.nn.functional.mse_loss(pred, y)
    loss.backward()
    optimizer.step()
    print(step, float(loss))
```

你应该能观察到：随着训练步数增加，损失通常会下降。这说明参数在朝着“更接近目标”的方向更新。

把这段代码的结构抽象一下，它已经是一条最小训练闭环：

```text
输入 -> 前向 -> 损失 -> backward -> step
```

## 常见误区

### 误区 1：`backward()` 会自动更新参数

不会。`backward()` 只负责计算梯度，真正更新是 `optimizer.step()`。

### 误区 2：损失下降一次就说明训练正确

一次下降没什么意义。你要看的是一个趋势，以及验证损失是否也合理变化。

### 误区 3：训练循环就是固定模板，不必理解

初期你当然会记住模板，但如果不理解：

- 为什么要 `zero_grad()`
- 为什么要除以梯度累积步数
- 为什么有时要 clip grad

那后面遇到 NaN、发散、显存限制时，你就没法调试。

<Callout title="为什么这一章很关键" tone="warning">
  后面你会看到完整训练器里出现 AMP、梯度累积、评估间隔和 checkpoint 保存。如果最小训练闭环没看懂，那些看起来就都会像随机拼装的工程细节。
</Callout>

## 练习题

1. 为什么通常要在每次训练步开始前调用 `optimizer.zero_grad()`？
2. 如果你只执行 `loss.backward()` 而不执行 `optimizer.step()`，模型会发生什么？
3. 为什么训练损失下降不等于模型一定泛化得更好？

## 下一章会用到什么

下一章会把视角从参数更新切回输入本身：文本到底如何被整理、切词并变成模型可处理的 token 序列。
