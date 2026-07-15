---
title: 6. 训练与优化
group:
  title: 训练
  order: 3
order: 6
toc: content
---

# 6. 训练与优化

## 训练循环最少需要什么

1. DataLoader
2. model
3. optimizer
4. scheduler
5. loss backward
6. gradient clip
7. checkpoint
8. evaluation

缺任何一个都不是完整工程。

## 为什么要做梯度累积

6GB 显存通常无法同时承载：

- 更大 batch
- 更长上下文
- 更宽模型

梯度累积的思路是：**把一个“大 batch”拆成多个小步前向反向，再统一更新参数。**

## mixed precision 为什么只在 CUDA 上默认开启

在这个项目里，AMP 是设备敏感的：

- CUDA：可以带来明显吞吐收益
- MPS：行为和成熟度不完全等价
- CPU：没有必要

所以项目默认按设备开关，而不是“一刀切”。

## checkpoint 需要保存什么

至少包括：

- `model.state_dict()`
- `optimizer.state_dict()`
- `scheduler.state_dict()`
- `step`

否则“恢复训练”只是口号。
