---
title: Part 5. 序列建模、Attention 与 Transformer
group:
  title: 学习主线
  order: 0
toc: content
---

# Part 5. 序列建模、Attention 与 Transformer

这一卷是整套知识档案的中心骨架之一。

到这里为止，前面三件事已经就位：

- 你知道数学对象怎样描述模型内部世界
- 你知道神经网络怎样从数据中学习
- 你知道文本怎样变成 token、样本和监督信号

接下来真正要回答的是：

> 为什么现代语言模型主体会长成 Attention + Transformer 这种结构？

## 这一卷当前包含的章节

- [01. 为什么早期序列建模会遇到瓶颈](/learning/part-5-sequence-modeling-and-transformers/01-why-earlier-sequence-models-hit-limits)
- [02. Attention 真正要解决什么问题](/learning/part-5-sequence-modeling-and-transformers/02-what-problem-attention-actually-solves)
- [03. Query、Key、Value 与加权读取](/learning/part-5-sequence-modeling-and-transformers/03-query-key-value-and-weighted-reading)
- [04. 因果注意力与 mask](/learning/part-5-sequence-modeling-and-transformers/04-causal-attention-and-masking)
- [05. 位置方法到底在补什么](/learning/part-5-sequence-modeling-and-transformers/05-what-positional-methods-actually-add)
- [06. Transformer block 为什么能反复堆叠](/learning/part-5-sequence-modeling-and-transformers/06-why-transformer-blocks-stack-so-well)
- [07. 一个完整 decoder-only 模型怎样组装](/learning/part-5-sequence-modeling-and-transformers/07-how-a-complete-decoder-only-model-is-assembled)

## 这一卷真正想纠正什么误解

它首先想纠正两个非常常见的误解。

### 第一，Transformer 不是“更高级的新公式”

它是对序列建模中“如何动态读取上下文”这个核心问题的一种结构化回答。

### 第二，Attention 不是“什么都看一眼”

它真正强的地方是：

> 让当前位置根据当前需求，在可见上下文里选择不同的信息读取路径。

只有把这两个误解纠正掉，后面的 Q、K、V、mask、position、block 才会变得有意义。

## 后续还会继续扩展什么

这一卷后续还会继续补：

- 多头注意力为什么不是简单并行重复
- FFN 在 block 中承担怎样的逐位置加工角色
- 更长上下文为什么会进一步逼出新的位置方法和注意力变体
- 推理阶段的 prefill / decode 与训练阶段的信息流有何异同

这一卷的目标不是让读者背完所有公式，而是让他能在看到任何一个小型 decoder-only 模型时，知道整条张量流为什么这样组织。
