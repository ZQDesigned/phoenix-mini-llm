---
title: Part 2. 数学预备、表示与概率直觉
group:
  title: 学习主线
  order: 0
toc: content
---

# Part 2. 数学预备、表示与概率直觉

这一分册解决的是一个经常被低估的问题：

> 为什么很多人明明已经开始接触大模型术语，却始终没有形成稳定理解？

一个很常见的原因是，读者太早进入了框架、模型和工程工具，但前面真正支撑理解的数学直觉并没有建立起来。

这里说的“数学”不是指：

- 把论文里的每个推导都推完
- 记住大量抽象定理
- 把自己训练成专门做理论证明的人

它更接近下面这些能力：

- 知道对象怎样写成数
- 知道数怎样按维度组织
- 知道矩阵乘法为什么是神经网络最常见的运算
- 知道概率分布为什么会出现在模型输出端
- 知道对数概率为什么几乎无处不在

这一分册的职责，就是先把这些能力从零搭起来。

## 这一分册包含哪些章节

- [01. 为什么学语言模型还要先学数学](/learning/part-2-mathematical-prerequisites/01-why-you-still-need-math-for-language-models)
- [02. 标量、向量、矩阵、张量与 shape](/learning/part-2-mathematical-prerequisites/02-scalars-vectors-matrices-tensors-and-shapes)
- [03. 矩阵乘法、线性变换与维度流动](/learning/part-2-mathematical-prerequisites/03-matrix-multiplication-linear-transformations-and-dimensional-flow)
- [04. 函数、复合与非线性为什么重要](/learning/part-2-mathematical-prerequisites/04-functions-composition-and-why-nonlinearity-matters)
- [05. 概率分布、期望与不确定性](/learning/part-2-mathematical-prerequisites/05-probability-distributions-expectation-and-uncertainty)
- [06. 对数、信息量与为什么损失常写成对数概率](/learning/part-2-mathematical-prerequisites/06-logarithms-information-and-why-loss-uses-log-probability)

## 这一分册在整套书里的位置

它不是为了把你留在抽象数学里，而是为了让你进入后面每一卷时不再只会背名词。

例如：

- 如果不理解 shape，你很难看懂模型里张量在怎样流动
- 如果不理解矩阵乘法，你很难真正明白线性层、投影和注意力计算
- 如果不理解条件概率和对数概率，你很难理解 next-token prediction 最后为什么会变成 loss

所以这部分是后面所有分册的前置层，不是可选阅读。

## 读完之后你应该达到什么状态

读完这一分册后，你应该至少能够：

- 看见一个张量形状时，知道每一维可能代表什么
- 看见一个矩阵乘法时，知道它是在做什么样的特征组合或维度投影
- 理解神经网络为什么离不开函数复合与非线性
- 理解语言模型为什么天然会落成概率分布预测
- 接受“对数概率”和“信息量”是训练目标里的自然对象，而不是奇怪的数学装饰

如果这些问题还不稳，进入下一卷时就会继续感到术语密度过高。
