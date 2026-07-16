---
title: Part 3. 机器学习、张量与神经网络基础
group:
  title: 学习主线
  order: 0
toc: content
---

# Part 3. 机器学习、张量与神经网络基础

如果说 Part 2 解决的是“数学对象到底是什么”，那么这一卷开始处理更关键的问题：

> 这些数学对象怎样组成一个真的会从数据中学习的系统？

很多初学者在接触 LLM 时，会很快看到这些词：

- linear
- softmax
- cross-entropy
- gradient
- optimizer

但如果这些词之间没有连成一条因果链，读者就会一直停留在“知道名字”的状态。

这一卷的任务，就是把这条因果链真正建立起来。

## 这一卷当前包含的章节

- [01. 机器学习到底在学什么](/learning/part-3-machine-learning-and-neural-networks/01-what-does-it-mean-to-learn)
- [02. 向量、矩阵、张量与 shape](/learning/part-3-machine-learning-and-neural-networks/02-vectors-matrices-and-tensors)
- [03. 线性层、激活函数与表示空间](/learning/part-3-machine-learning-and-neural-networks/03-linear-layers-activations-and-representations)
- [04. 概率、softmax 与交叉熵](/learning/part-3-machine-learning-and-neural-networks/04-probability-softmax-and-cross-entropy)
- [05. 梯度、反向传播与优化](/learning/part-3-machine-learning-and-neural-networks/05-gradients-backpropagation-and-optimization)
- [06. 过拟合、泛化与验证集](/learning/part-3-machine-learning-and-neural-networks/06-overfitting-generalization-and-validation)
- [07. 为什么序列数据比普通表格数据更难](/learning/part-3-machine-learning-and-neural-networks/07-why-sequence-data-is-harder-than-tabular-data)

## 这一卷正在回答哪些大问题

它本质上在回答六个连续问题：

1. 模型到底在“学习”什么  
2. 数据在模型内部怎样表现成向量与张量  
3. 线性层和激活函数为什么能组成有表达力的网络  
4. 为什么输出端会变成分布预测与 loss  
5. 为什么梯度能驱动参数改进  
6. 为什么训练集上的进步不总等于泛化能力提升  

只要这六个问题没有串起来，后面的 tokenizer、Transformer 和训练器就会继续显得像一堆局部技巧。

## 这一卷与前后两卷的关系

### 它依赖 Part 2

Part 2 讲的是：

- shape
- 矩阵乘法
- 非线性
- 条件概率
- 对数概率

这些都属于这一卷的前置对象。

### 它又是 Part 4 和 Part 5 的前置

到了文本和 Transformer 卷，你会不断遇到：

- 表示空间
- 分布预测
- logits
- loss
- 梯度

如果这一卷不稳，后面所有模型章节都会继续悬空。

## 后续还会继续补哪些主题

这一卷接下来还会继续长出更完整的基础章节，例如：

- 从线性模型到多层感知机的演化
- 参数量、容量与表达能力的关系
- 批量训练与随机梯度下降的统计视角

这些主题会和当前章节继续汇合，而不是另起一套术语体系。
