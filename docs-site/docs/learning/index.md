---
title: 学习主线总览
nav:
  title: 学习主线
  order: 2
group:
  title: 学习主线
  order: 0
toc: content
---

# 学习主线总览

这一部分现在不再把自己定义成“一组围绕项目的补充说明”，而是把目标抬高到一本真正可连续阅读的入门书稿：

> 一个完全从零开始的读者，在按顺序读完这套知识档案之后，应该能够真正理解并亲手实现一个小型语言模型。

这意味着它必须承担三层任务：

- 先补齐进入大模型之前真正缺失的基础知识
- 再把语言模型自己的概念体系讲成一条连续链路
- 最后把这些知识自然连接到训练、推理、调试与后续扩展

如果这三层没有被分开，文档就会出现典型失真：

- 工程命令写了很多，但模型本体没有讲透
- token、Attention、KV cache 这些词出现得太早
- 初学者知道术语，却无法解释它们为什么存在

## 为什么原先的架构还不够

问题并不只是“每章字数不够”，而是章节结构本身会直接限制文档最终能长成什么样。

如果把整套内容压在少量粗颗粒章节里，会发生几件事：

- 前置层次会被压扁，神经网络、概率、优化这些地基会来不及讲透
- 工程与概念会互相缠住，读者容易误以为“学大模型”主要是在学工具
- 后续即使继续扩写，也只是在不稳定的骨架上堆字数

所以这一部分现在改成更接近书稿的组织方式：

> 不是“12 章串起来的项目预备知识”，而是“8 个分册逐层展开的语言模型基础课程”。

## 新的设计原则

新的 `learning` 主线按下面几个原则组织。

### 第一，先讲会反复复用的基础，再讲专属于 LLM 的结构

读者在进入 tokenizer、Transformer 之前，必须先稳住：

- 数值表示
- 维度与矩阵运算
- 函数复合与非线性
- 概率分布与对数概率
- 梯度、优化和泛化

如果这层不稳，后面所有“看起来更高级”的部分都只会沦为记名词。

### 第二，把“文本处理”视为模型定义的一部分

很多入门资料会把 tokenizer 和数据组织当成预处理小节，仿佛真正重要的是模型结构。

这会误导读者。

对语言模型来说：

- 文本怎样编码
- 怎样切 token
- special token 怎样设计
- 样本怎样打包
- 目标怎样右移

这些定义本身就在决定模型到底学什么。

### 第三，把“能实现”与“能解释”都当成目标

这套知识档案不是源码导读，也不是纯理论讲义。

它的目标是让读者同时获得两种能力：

- 看见某个结构时，知道它为什么存在
- 动手实现时，知道它在训练链路里的输入、输出与风险点

## 现在的主结构：八个分册

### Part 1. 入门与学习地图

- [分册总览](/learning/part-1-orientation)
- [01. 什么是语言模型](/learning/part-1-orientation/01-what-is-a-language-model)
- [02. 为什么应该先做一个小模型](/learning/part-1-orientation/02-why-start-with-a-small-model)
- [03. 怎样使用这套知识档案](/learning/part-1-orientation/03-how-to-use-this-book)

这一分册负责先把目标摆正。它不讲实现细节，而是先回答：

- 语言模型的任务定义是什么
- 为什么学习阶段应该追求“小而完整”
- 怎样阅读这套知识档案才不会走成术语记忆路线

### Part 2. 数学预备、表示与概率直觉

- [分册总览](/learning/part-2-mathematical-prerequisites)
- [01. 为什么学语言模型还要先学数学](/learning/part-2-mathematical-prerequisites/01-why-you-still-need-math-for-language-models)
- [02. 标量、向量、矩阵、张量与 shape](/learning/part-2-mathematical-prerequisites/02-scalars-vectors-matrices-tensors-and-shapes)
- [03. 矩阵乘法、线性变换与维度流动](/learning/part-2-mathematical-prerequisites/03-matrix-multiplication-linear-transformations-and-dimensional-flow)
- [04. 函数、复合与非线性为什么重要](/learning/part-2-mathematical-prerequisites/04-functions-composition-and-why-nonlinearity-matters)
- [05. 概率分布、期望与不确定性](/learning/part-2-mathematical-prerequisites/05-probability-distributions-expectation-and-uncertainty)
- [06. 对数、信息量与为什么损失常写成对数概率](/learning/part-2-mathematical-prerequisites/06-logarithms-information-and-why-loss-uses-log-probability)

这是新的真正前置层。它不假设读者已经能把“向量”“对数概率”“分布预测”这些词稳定地连成一条线，而是从头建立：

- 对象怎样被写成数
- 数怎样按维度组织
- 为什么神经网络本质上不断做线性变换与非线性复合
- 为什么语言模型最后会写成一个条件分布预测问题

### Part 3. 机器学习、张量与神经网络基础

- [分册总览](/learning/part-3-machine-learning-and-neural-networks)
- [01. 机器学习到底在学什么](/learning/part-3-machine-learning-and-neural-networks/01-what-does-it-mean-to-learn)
- [02. 向量、矩阵、张量与 shape](/learning/part-3-machine-learning-and-neural-networks/02-vectors-matrices-and-tensors)
- [03. 线性层、激活函数与表示空间](/learning/part-3-machine-learning-and-neural-networks/03-linear-layers-activations-and-representations)
- [04. 概率、softmax 与交叉熵](/learning/part-3-machine-learning-and-neural-networks/04-probability-softmax-and-cross-entropy)
- [05. 梯度、反向传播与优化](/learning/part-3-machine-learning-and-neural-networks/05-gradients-backpropagation-and-optimization)
- [06. 过拟合、泛化与验证集](/learning/part-3-machine-learning-and-neural-networks/06-overfitting-generalization-and-validation)
- [07. 为什么序列数据比普通表格数据更难](/learning/part-3-machine-learning-and-neural-networks/07-why-sequence-data-is-harder-than-tabular-data)

如果说 Part 2 在解决“数学对象是什么”，那么 Part 3 解决的就是：

- 模型怎样从数据中学习
- 线性层和激活函数为什么能组成神经网络
- logits、softmax、cross-entropy 之间怎样连起来
- 梯度和优化器为什么能驱动参数改变

这部分读完之后，读者应该已经能理解一个基础神经网络训练闭环。

### Part 4. 文本、编码与 Tokenizer

- [分册总览](/learning/part-4-text-and-tokenization)
- [01. 语料、样本与数据分布](/learning/part-4-text-and-tokenization/01-corpora-samples-and-data-distribution)
- [02. Unicode、字节与文本规范化](/learning/part-4-text-and-tokenization/02-unicode-bytes-and-text-normalization)
- [03. Token、词表与 special token](/learning/part-4-text-and-tokenization/03-tokens-vocabularies-and-special-tokens)
- [04. 子词分词、BPE 与 tokenizer 训练](/learning/part-4-text-and-tokenization/04-subword-tokenization-bpe-and-tokenizer-training)
- [05. 从 token 流到固定长度训练样本](/learning/part-4-text-and-tokenization/05-from-token-streams-to-fixed-length-training-samples)
- [06. 为什么训练目标表现成右移一位](/learning/part-4-text-and-tokenization/06-why-the-objective-looks-like-a-one-token-shift)

这一分册开始把视角转向语言数据本身，解释：

- 文本为什么不能直接进神经网络
- token 化为什么是一种建模选择
- tokenizer 为什么属于模型定义的一部分
- next-token prediction 怎样在数据层面真正落地

### Part 5. 序列建模、Attention 与 Transformer

- [分册总览](/learning/part-5-sequence-modeling-and-transformers)
- [01. 为什么早期序列建模会遇到瓶颈](/learning/part-5-sequence-modeling-and-transformers/01-why-earlier-sequence-models-hit-limits)
- [02. Attention 真正要解决什么问题](/learning/part-5-sequence-modeling-and-transformers/02-what-problem-attention-actually-solves)
- [03. Query、Key、Value 与加权读取](/learning/part-5-sequence-modeling-and-transformers/03-query-key-value-and-weighted-reading)
- [04. 因果注意力与 mask](/learning/part-5-sequence-modeling-and-transformers/04-causal-attention-and-masking)
- [05. 位置方法到底在补什么](/learning/part-5-sequence-modeling-and-transformers/05-what-positional-methods-actually-add)
- [06. Transformer block 为什么能反复堆叠](/learning/part-5-sequence-modeling-and-transformers/06-why-transformer-blocks-stack-so-well)
- [07. 一个完整 decoder-only 模型怎样组装](/learning/part-5-sequence-modeling-and-transformers/07-how-a-complete-decoder-only-model-is-assembled)

这一分册负责讲清模型主体为什么会长成今天这个样子。重点不是背公式，而是建立完整问题链：

- 为什么序列建模天生困难
- Attention 的真实任务是什么
- causal mask、位置方法、残差和 FFN 分别在补什么
- 一个完整 decoder-only 模型的张量流怎样从 token ids 走到 logits

### Part 6. 训练一个小型语言模型

- [分册总览](/learning/part-6-training-a-small-language-model)

这里开始把视角从结构转向训练系统。后续会系统展开：

- batch、tokens、steps、epochs 到底分别在统计什么
- optimizer、learning rate、warmup 怎样共同定义训练动力学
- 梯度累积、混合精度、裁剪和检查点分别在解决什么约束
- 小显存环境下怎样建立可靠、可重复的实验链路

### Part 7. 推理、评估与调试

- [分册总览](/learning/part-7-inference-evaluation-and-debugging)

模型训练完并不意味着理解就完成了。这里处理：

- 自回归生成的真正执行过程
- greedy、temperature、top-k、top-p 的差异
- KV cache 为什么会出现
- loss、perplexity、样例观测与链路调试如何互相配合

### Part 8. 从小模型走向更大世界

- [分册总览](/learning/part-8-where-to-go-next)

最后一卷负责给读者更宽的地图，让他知道从这个学习项目继续往前，会自然遇到：

- 预训练与微调
- 指令跟随与对齐
- LoRA、量化、部署
- 更长上下文、更高效注意力与更复杂训练系统

## 推荐阅读方式

### 第一遍：按主线顺序完整走一遍

不要跳到你觉得“最酷”的部分，直接按分册顺序阅读：

1. Part 1：先理解任务和学习目标  
2. Part 2：补齐数学与概率直觉  
3. Part 3：建立神经网络与训练闭环  
4. Part 4：理解文本如何变成监督信号  
5. Part 5：进入 Transformer 本体  
6. Part 6：再看训练系统  
7. Part 7：最后进入推理、评估与调试  

### 第二遍：结合复刻教程回查

当你已经开始照着复刻教程动手时，阅读方式会自然改变：

- 写 tokenizer 时回查 Part 4
- 写模型主体时回查 Part 5
- 写训练器时回查 Part 3 和 Part 6
- 调生成与排障时回查 Part 7

这时知识会从“能读懂”进入“能拿来判断与修正”。

## 这套知识档案与项目源码的边界

知识档案的职责不是注释当前仓库，而是建立一套可迁移的理解。

它应该尽量做到：

- 即使不看当前项目源码，也能独立阅读
- 即使将来换一个小型 LLM 项目，核心概念仍然成立
- 即使读者暂时还没开始实现，也能先建立判断标准

源码、复刻教程和踩坑记录当然都重要，但它们是另外三类材料：

- 知识档案：解释“为什么会有这些概念”
- 复刻教程：解释“怎样一步步把项目做出来”
- 踩坑记录：解释“实际实现过程中哪些地方最容易错”

这三者应该互相指向，但不应该互相替代。

## 它接下来会长成什么样

这一版重构的重点不是机械加字，而是先把文档变成一个可持续扩写的书稿架构。

接下来会继续往前推进的方向包括：

- 把 Part 6 拆成真正完整的训练分册
- 把 Part 7 扩成推理、评估与调试的操作型知识库
- 在 Part 2 和 Part 3 继续补更多“从零基础可读”的解释层
- 让复刻教程严格对应到知识档案里的章节前置要求

目标不是把文档堆成一大堆页面，而是把它写成：

> 一个初学者可以按顺序读，读完之后真正理解小型语言模型从零实现路径的长篇知识体系。
