---
title: Part 2. 数学与神经网络基础
group:
  title: 学习主线
  order: 0
toc: content
---

# Part 2. 数学与神经网络基础

## 为什么这一分册必须被提前

如果你直接从 tokenizer、Attention、Transformer 开始学，而前面没有真正搞清楚：

- 向量和张量到底是什么
- 线性层在做什么
- 概率和损失函数有什么关系
- 梯度为什么能让参数变好

那么后面你看到的很多结构都会变成一串只能照抄的模板。

这一分册存在的意义，就是把这些“本该先懂的东西”提到前面来。

## 这一分册要补齐哪些地基

它会系统解决下面这些问题：

- 机器学习到底是在学什么映射
- 为什么神经网络需要表示空间和非线性
- 张量形状为什么是理解模型结构的第一语言
- softmax 和 cross-entropy 分别在做什么
- 反向传播和优化器为什么能驱动学习

当这些问题被讲透之后，你再进入文本、Transformer 和训练工程，就不再是在黑箱外面背接口。

## 这一分册包含哪些章节

- [01. 机器学习到底在学什么](/learning/part-2-neural-network-foundations/01-what-does-it-mean-to-learn)
- [02. 向量、矩阵、张量与 shape](/learning/part-2-neural-network-foundations/02-vectors-matrices-and-tensors)
- [03. 线性层、激活函数与表示空间](/learning/part-2-neural-network-foundations/03-linear-layers-activations-and-representations)
- [04. 概率、softmax 与交叉熵](/learning/part-2-neural-network-foundations/04-probability-softmax-and-cross-entropy)
- [05. 梯度、反向传播与优化](/learning/part-2-neural-network-foundations/05-gradients-backpropagation-and-optimization)
- [06. 过拟合、泛化与验证集](/learning/part-2-neural-network-foundations/06-overfitting-generalization-and-validation)

## 读完之后你应该达到什么状态

读完这一分册，你应该已经能够：

- 看懂一段基础神经网络前向计算在干什么
- 看到形状时能在脑中形成张量流
- 理解 logits、softmax、loss 之间的因果关系
- 明白“学习”为什么会表现成参数更新

如果这些问题仍然不稳，就先不要急着进入更靠后的 LLM 专题。
