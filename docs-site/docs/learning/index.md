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

这一部分现在不再把自己定义成“12 章项目预备知识”。它要承担的目标更大，也更严格：

> 它应该像一套真正的入门书，从零开始，把一个初学者带到能够独立理解并实现一个小型语言模型。

这意味着它不能只解释：

- token 是什么
- Attention 是什么
- 训练脚本怎么跑

它还必须在更靠前的位置补上很多此前缺失的地基，例如：

- 机器学习到底在学什么
- 神经网络为什么能表示复杂函数
- 概率、softmax、交叉熵和损失函数是什么关系
- 梯度、反向传播与优化器为什么决定模型能不能学会

如果这些前置层没有讲透，那么后面哪怕把 Transformer 讲得再细，读者也仍然会停留在“知道术语，但不会独立判断”的阶段。

## 为什么原来的线性 12 章结构不够

原来的结构有几个明显问题。

### 第一，前置知识层次不完整

它直接进入：

- Python 环境
- tensor 直觉
- tokenizer
- Attention

但在这些主题前面，读者其实还缺：

- 机器学习的任务观
- 神经网络的最小工作原理
- 表示空间与非线性
- 概率与损失函数

也就是说，很多本该在“进入 LLM 之前”解决的问题，被推迟到了读者已经开始接触 LLM 术语之后。

### 第二，工程内容出现得过早

环境、命令行、包管理当然重要，但它们不应该在知识主线上过早占据主体位置。因为这会让读者误以为“学大模型”主要是在学工具链，而不是在学模型本身。

工具内容应该保留，但应该被放在更合适的位置：

- 作为必要前置说明
- 作为教程中的实际操作内容
- 作为附属工程支撑，而不是概念主干

### 第三，章节颗粒度过粗

真正一本能把人带入门的技术书，不会只用十来个大章节把整个领域一口气包完。因为：

- 单章负担会过重
- 概念间的递进会被压扁
- 读者很难知道自己卡在了哪一级知识台阶

所以这部分现在要改成“分册 + 章节”的结构，让知识递进更自然。

## 新的组织方式：从“章节串”改成“分册书”

新的 `learning` 会按 7 个分册组织：

1. 入门与学习地图  
2. 数学与神经网络基础  
3. 文本为什么能变成训练数据  
4. Transformer 与语言模型主体  
5. 训练一个小型语言模型  
6. 推理、评估与调试  
7. 从小模型走向更大模型  

这样的好处很直接：

- 初学者能先补齐真正缺失的地基
- 概念和工程实现可以被更清楚地分层
- 后续继续扩写时，不会再受制于“12 章硬挤所有内容”的上限

## 这套知识档案现在的定位是什么

它既不是：

- 某个仓库的源码导读
- 某一篇论文的精读笔记
- 一页式大模型名词表

也不是纯工程实操手册。

它的定位是：

> 一套围绕“小型语言模型从零实现”这个目标展开的基础理论书稿。

“基础”不等于浅。它意味着：

- 先讲真正决定理解质量的底层问题
- 再一层层走到 tokenizer、Transformer、训练、推理和调试
- 尽量减少对本项目源码的依赖
- 尽量让知识本身具有可迁移性

如果你读完这套内容后换一个小型 LLM 项目，你仍然应该能看懂并判断。这才说明它是合格的知识档案，而不是对当前仓库的注释。

## 新阅读路线

### Part 1. 入门与学习地图

- [分册总览](/learning/part-1-orientation)
- [01. 什么是语言模型](/learning/part-1-orientation/01-what-is-a-language-model)
- [02. 为什么应该先做一个小模型](/learning/part-1-orientation/02-why-start-with-a-small-model)
- [03. 怎样使用这套知识档案](/learning/part-1-orientation/03-how-to-use-this-book)

这一分册先把学习目标摆正。你会先知道自己到底在学什么，再进入后面的数学与模型部分。

### Part 2. 数学与神经网络基础

- [分册总览](/learning/part-2-neural-network-foundations)
- [01. 机器学习到底在学什么](/learning/part-2-neural-network-foundations/01-what-does-it-mean-to-learn)
- [02. 向量、矩阵、张量与 shape](/learning/part-2-neural-network-foundations/02-vectors-matrices-and-tensors)
- [03. 线性层、激活函数与表示空间](/learning/part-2-neural-network-foundations/03-linear-layers-activations-and-representations)
- [04. 概率、softmax 与交叉熵](/learning/part-2-neural-network-foundations/04-probability-softmax-and-cross-entropy)
- [05. 梯度、反向传播与优化](/learning/part-2-neural-network-foundations/05-gradients-backpropagation-and-optimization)
- [06. 过拟合、泛化与验证集](/learning/part-2-neural-network-foundations/06-overfitting-generalization-and-validation)

这是新的真正地基。你后面读 token、embedding、Attention、logits 和 loss 时，都会依赖这一部分。

### Part 3. 文本为什么能变成训练数据

- [分册总览](/learning/part-3-text-as-data)
- [01. 语料、样本与数据分布](/learning/part-3-text-as-data/01-corpora-samples-and-data-distribution)
- [02. Unicode、字节与文本规范化](/learning/part-3-text-as-data/02-unicode-bytes-and-text-normalization)
- [03. Token、词表与 special token](/learning/part-3-text-as-data/03-tokens-vocabularies-and-special-tokens)

这一分册会系统展开：

- 语料是什么
- 文本为什么不能直接喂给模型
- Unicode、字节与清洗为什么重要
- token、词表、subword 和 special token 到底在定义什么
- next-token prediction 为什么是语言模型的核心任务

### Part 4. Transformer 与语言模型主体

- [分册总览](/learning/part-4-transformers-and-language-models)

这一分册会把视角从“文本如何进入模型”转向“模型怎样处理文本”，系统讲清：

- 为什么旧的序列建模办法不够
- Attention 的问题定义
- causal mask、多头注意力、位置方法
- Transformer block 和 decoder-only 架构

### Part 5. 训练一个小型语言模型

- [分册总览](/learning/part-5-training-a-small-language-model)

这里开始处理真正的训练系统，包括：

- batch、tokens、steps 和 epochs
- optimizer、学习率、warmup
- gradient accumulation、mixed precision、clipping
- checkpoint、日志与实验管理

### Part 6. 推理、评估与调试

- [分册总览](/learning/part-6-inference-evaluation-and-debugging)

这一分册处理“模型训练完之后怎样使用和判断”的问题，包括：

- 自回归生成
- 采样策略
- KV cache
- 困惑度与样例评估
- 极小数据过拟合测试
- 故障定位方法

### Part 7. 从小模型走向更大模型

- [分册总览](/learning/part-7-where-to-go-next)

这一分册不是为了把初学者立刻推向超大工程，而是为了让你知道：

- 大模型和小模型的核心连续性是什么
- 预训练、微调、指令跟随、对齐大致是怎样的层次
- LoRA、量化、部署为什么会出现
- 学完这个项目后下一步应该去哪里

## 这套书和复刻教程是什么关系

新的关系应该更清楚：

- `学习主线` 负责建立通用理解和知识层级
- `复刻教程` 负责把这些知识落成一个具体项目

如果你把学习主线当成项目注释，效果会很差。

如果你把复刻教程当成唯一学习资料，效果也会很差。

更合理的方式是：

1. 先顺序阅读 Part 1 和 Part 2  
2. 再进入文本、Transformer 和训练分册  
3. 在进入复刻教程后，针对卡住的问题回查对应分册  

这样你不会只学到“怎么把命令跑通”，而会学到“为什么这样设计”。

## 旧版页面如何处理

为了不打断现有教程里的交叉链接，原来的 12 个页面会暂时保留为兼容入口，但它们不再代表新的主读路径。

新的主读路径以上面的分册为准。

后续随着新分册内容继续写深，旧版页面会逐步被拆解、吸收或弱化。

## 这部分最终应该达到什么体量

这不是一句“以后再说”的空话，而是这套知识档案现在必须追求的明确目标：

> 它最终应该具备真正书籍级的体量，而不是放大版项目 README。

这意味着：

- 它会有更多分册和章节
- 每个基础主题都要讲慢、讲透、讲出递进关系
- 神经网络、概率、优化、文本处理这些基础不能只点到为止
- LLM 相关知识要放回整个机器学习和序列建模脉络中理解

如果这点做不到，那么这套文档就不可能承担“从零带人入门”的职责。

## 现在应该从哪里开始

新的主读顺序从这里开始：

1. [Part 1. 入门与学习地图](/learning/part-1-orientation)
2. [Part 2. 数学与神经网络基础](/learning/part-2-neural-network-foundations)

如果你已经开始复刻项目，但发现自己对某些基础概念并不稳定，也建议回到这两部分重新补地基。对真正的初学者来说，最宝贵的不是“赶快进入 Transformer”，而是：

> 进入 Transformer 之前，已经知道什么叫学习、表示、概率、损失和优化。
