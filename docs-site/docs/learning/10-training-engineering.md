---
title: 10. 训练工程
group:
  title: 学习主线
  order: 0
order: 9
toc: content
---

# 10. 训练工程

## 这一章要解决什么问题

模型结构写完之后，真正让项目可用的是训练工程。很多小模型项目不是输在理论，而是输在：

- batch 配不对
- 设备切换写死
- checkpoint 不可恢复
- 验证集根本没跑
- 显存不够时不知道如何退让

这一章会把这些工程要素串起来。

## 你需要先知道什么

- 理解最小训练闭环。
- 理解模型配置与显存预算关系。

## 核心概念

### 1. DataLoader 解决“怎么稳定喂 batch”

模型并不直接读取 `.npy` 文件，而是通过数据集对象和 DataLoader 迭代 batch。这样训练循环只关心：

- 当前 batch 的 `input_ids`
- 当前 batch 的 `targets`

而不用关心底层数据是如何存储和切片的。

### 2. batch size 不够大时，用梯度累积弥补

显存有限时，单次前向传播可能只能容纳很小的 micro-batch。梯度累积的做法是：

1. 连续处理多个小 batch
2. 每个 batch 的损失除以累积步数
3. 多次 backward 后再统一 step

这样可以近似模拟更大的有效 batch size。

### 3. AMP 是显存和吞吐量优化，不是默认正确答案

自动混合精度在 CUDA 上常常有帮助，但它不是“开了就一定更好”。你需要明确：

- 只在支持的设备上启用
- NaN 或不稳定时要能回退
- macOS MPS 和 Windows CUDA 的行为不一定一样

### 4. checkpoint 不是锦上添花，而是训练可恢复性的底线

一个合格的训练项目至少应该保存：

- `model.state_dict()`
- `optimizer.state_dict()`
- 当前 step
- 相关 metadata

这样你才能：

- 中断后继续训练
- 比较不同阶段结果
- 把训练好的模型拿去评估和生成

### 5. 验证集不是为了“最后看一眼”

验证集的职责是帮助你区分：

- 模型是否继续在训练集上记忆
- 模型是否对未见数据还有泛化能力

所以训练器里必须有定期评估，而不是只打印训练损失。

## 最小必要数学

### 有效 batch size

如果：

- `batch_size = 4`
- `gradient_accumulation_steps = 8`

那么近似有效 batch size 可以理解成：

\[
4 \times 8 = 32
\]

这不是完全等价于真实大 batch，但在学习项目里是非常常见的显存折中方案。

## 最小代码实验

下面是一个极简的梯度累积示意：

```python
optimizer.zero_grad()

for _ in range(grad_accum_steps):
    output = model(input_ids=batch_x, targets=batch_y)
    loss = output.loss / grad_accum_steps
    loss.backward()

optimizer.step()
```

关键点不是语法，而是这件事背后的含义：

- 你把多个小 batch 的梯度累积到一起
- 再统一执行一次参数更新

## 常见误区

### 误区 1：训练能跑就说明工程没问题

一个脚本哪怕只会“从头跑到尾”，也可能是糟糕工程：

- 不能恢复
- 不能评估
- 不能记录关键信息
- 设备切换不安全

### 误区 2：混合精度是必须开启的默认选项

不是。它是优化手段，不是基本正确性的一部分。先确保 FP32 路径正确，再去启用 AMP。

### 误区 3：batch 小就只能认输

梯度累积、缩短上下文、减小 hidden size、降低层数，都是合理的显存退让方式。

<Callout title="和仓库实现最相关的部分" tone="warning">
  在 `phoenix-mini-llm` 的训练循环里，你会看到梯度累积、AMP 条件启用、梯度裁剪、定期评估和 checkpoint 保存。读源码时要始终问自己：它是在解决哪一个训练工程问题？
</Callout>

## 练习题

1. 梯度累积为什么能帮助显存受限设备训练更大的有效 batch？
2. 为什么 checkpoint 至少要保存模型参数和优化器状态？
3. 为什么验证损失比单纯训练损失更能说明模型是否在进步？

## 下一章会用到什么

下一章会把训练好的模型拿来真正生成文本，并讲清楚 greedy、temperature、top-k、top-p 和 KV cache 分别在做什么。
