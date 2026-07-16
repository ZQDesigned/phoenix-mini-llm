---
title: Part 6. 训练一个小型语言模型
group:
  title: 学习主线
  order: 0
toc: content
---

# Part 6. 训练一个小型语言模型

很多人会把“模型主体写出来”和“模型真的学起来”混为一谈。

这是错误的。

一个能训练起来的小型语言模型，除了结构本身，还依赖另一整层系统：

- batch 怎样组织
- token 数怎样换算成 step 和 epoch
- 优化器和学习率怎样驱动更新
- 小显存下怎样处理梯度累积、混合精度和裁剪
- 训练中怎样记录、保存和恢复状态

所以这一卷关注的不是“又一个组件”，而是：

> 训练这件事怎样作为一个完整系统稳定成立。

## 这一卷接下来的章节规划

这一卷现在按下面的主线展开：

- [01. batch、token、step 与 epoch 到底在统计什么](/learning/part-6-training-a-small-language-model/01-what-batches-tokens-steps-and-epochs-really-count)
- [02. 优化器到底在改什么](/learning/part-6-training-a-small-language-model/02-what-the-optimizer-is-actually-changing)
- [03. 学习率、warmup 与为什么训练会在早期崩掉](/learning/part-6-training-a-small-language-model/03-learning-rate-warmup-and-why-early-training-breaks)
- [04. 小显存下为什么要做梯度累积](/learning/part-6-training-a-small-language-model/04-why-gradient-accumulation-matters-under-small-vram)
- [05. 混合精度、GradScaler 与设备差异](/learning/part-6-training-a-small-language-model/05-mixed-precision-gradscaler-and-device-differences)
- [06. 梯度裁剪、NaN 与不稳定更新](/learning/part-6-training-a-small-language-model/06-gradient-clipping-nan-and-unstable-updates)
- [07. checkpoint、验证集与实验记录](/learning/part-6-training-a-small-language-model/07-checkpoints-validation-and-experiment-records)

这一卷会尽量保持“概念先行，但能直接用于实现判断”的写法，而不是堆砌调参经验。

## 这一卷的内部逻辑

它并不是把训练工程拆成一堆彼此独立的技巧，而是在解释一条连续链路：

1. 你先要知道训练到底在以什么单位计量  
2. 再知道参数更新究竟由什么机制驱动  
3. 再知道学习率怎样决定训练节奏  
4. 然后才轮到显存约束、数值稳定性与恢复机制  

如果把这些顺序打乱，很多技巧都会显得像没有背景的配方。

## 读完之后你应该获得的能力

读完这一卷后，你至少应该能稳定回答：

- 为什么训练日志里总在讨论 step、token 和 effective batch
- 为什么优化器不是可有可无的“最后一步”
- 为什么学习率设置错误会让一切看起来都像模型结构问题
- 为什么小显存训练必须考虑梯度累积与混合精度
- 为什么 checkpoint、验证与实验记录属于训练本体，而不是附属脚本
