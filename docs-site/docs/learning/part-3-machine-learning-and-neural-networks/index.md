---
title: 机器学习篇总览：卷四到卷六
group:
  title: 机器学习篇总览
  order: 98
toc: content
---

# 机器学习篇总览：卷四到卷六

这个入口页不替代主线卷首页。

它的职责，是把整套书里“从学习问题到神经网络训练动力学”的这一段知识压缩成一张可回看的地图。

如果你按正式主线阅读，优先顺序应该是：

- [卷四. 从数据到学习问题](/learning/part-4-learning-from-data)
- [卷五. 神经网络作为表示学习系统](/learning/part-5-neural-networks-and-optimization)
- [卷六. 优化、噪声与泛化](/learning/part-6-optimization-and-generalization)

这里更适合在下面几种场景使用：

- 你已经开始读后面的文本建模或 Transformer，想回头确认前置知识链。
- 你需要一张紧凑目录，重新组织读书笔记。
- 你想快速判断自己在机器学习地基上还缺哪一段。

## 为什么这一整段必须单独稳住

很多大模型入门材料会很快跳到：

- tokenizer
- attention
- Transformer
- 训练脚本

这种跳法会制造一个危险错觉：

> 好像真正的难点只在大模型结构本身。

但现实恰好相反。

如果你没有先稳住下面这些问题：

- 什么叫学习问题
- 样本、输入、目标和监督怎样被定义
- 神经网络为什么会成为表示学习系统
- logits、softmax 与交叉熵为什么会自然出现
- 梯度和反向传播怎样把误差传回参数
- mini-batch、噪声、过拟合和验证分别在回答什么

那么后面的语言模型知识就会一直漂在半空中。

## 为什么现在把这一段拆成三卷

过去很多资料习惯把这一整段塞成两块：

- 学习问题
- 神经网络训练系统

这对熟悉背景的人足够，对完全初学者不够稳。

因为“神经网络训练系统”本身就至少包含两层不同主题：

1. 神经网络怎样形成内部表示并接到输出分布。
2. 模型怎样在带噪训练里被优化，并为什么会出现泛化问题。

所以现在主线明确拆成三卷。

## 卷四：从数据到学习问题

这一卷解决的是一切训练开始之前更靠前的问题：

- 机器学习里的“学习”到底是什么意思
- 原始材料怎样被切成样本
- 特征、目标和标签各是什么角色
- 张量布局为什么必须和语义一起理解
- 为什么线性模型是进入神经网络最透明的起点

对应章节：

- [01. 机器学习到底在学什么](/learning/part-3-machine-learning-and-neural-networks/01-what-does-it-mean-to-learn)
- [02. 样本、特征、标签、batch 与张量布局](/learning/part-3-machine-learning-and-neural-networks/02-vectors-matrices-and-tensors)
- [03. 从线性模型到第一个神经网络](/learning/part-3-machine-learning-and-neural-networks/04-from-linear-models-to-the-first-neural-network)

这一卷的作用，是先把“模型到底准备学什么”讲清楚。

## 卷五：神经网络作为表示学习系统

这一卷把读者真正带入网络内部：

- 线性层为什么仍然是骨架
- 激活函数为什么在打破表达上限
- 隐藏表示到底是什么意思
- softmax 和交叉熵为什么会自然出现

对应章节：

- [01. 线性层、激活函数与表示空间](/learning/part-3-machine-learning-and-neural-networks/05-linear-layers-activations-and-representations)
- [02. 概率、softmax 与交叉熵](/learning/part-3-machine-learning-and-neural-networks/06-probability-softmax-and-cross-entropy)

这一卷的任务，是先让你真正看清神经网络“是什么样的一台学习系统”。

## 卷六：优化、噪声与泛化

这一卷把静态结构推进成动态训练过程：

- 梯度到底是什么
- 反向传播为什么能把误差分配回所有参数
- mini-batch 为什么会让训练天然带噪
- 为什么训练表现和泛化表现不是一回事

对应章节：

- [01. 梯度、链式法则、反向传播与优化](/learning/part-3-machine-learning-and-neural-networks/07-gradients-backpropagation-and-optimization)
- [02. 小批量梯度下降、噪声与为什么训练是一种统计过程](/learning/part-3-machine-learning-and-neural-networks/08-mini-batch-gradient-descent-noise-and-why-training-is-statistical)
- [03. 过拟合、泛化与验证集](/learning/part-3-machine-learning-and-neural-networks/09-overfitting-generalization-and-validation)

这一卷的任务，是让你真正理解模型“怎样学”以及“为什么会学歪”。

## 为什么这三卷对语言模型尤其关键

语言模型并没有跳出这三卷建立的主线。

它只是把这条主线搬到了序列世界里：

- token 序列仍然是样本
- next-token prediction 仍然是目标定义
- logits 仍然是输出接口
- 交叉熵仍然是误差表达
- 梯度和优化仍然在闭合同一条训练循环

也就是说，大模型不是从这里另起炉灶。

它是在这套机器学习主线上，换了输入对象、换了结构复杂度、换了更苛刻的序列约束。

## 如果你想从这里继续往后读

读完卷四到卷六后，最自然的下一步是进入：

- [卷七. 文本怎样进入模型：语料、编码与分词](/learning/part-4-text-and-tokenization)

因为到那时你已经可以带着更稳的视角去看：

- 文本怎样成为样本
- token 怎样成为输入单位
- 语言模型的监督为什么会从同一条序列内部长出来
