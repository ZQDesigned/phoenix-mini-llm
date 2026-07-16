---
title: Part 4. 文本、编码与 Tokenizer
group:
  title: 学习主线
  order: 0
toc: content
---

# Part 4. 文本、编码与 Tokenizer

这一卷开始把视角从“神经网络怎样学习”推进到“文本怎样变成可学习对象”。

很多人第一次做语言模型项目时，都会经历一个误判：

> 我已经理解了模型结构，所以数据前处理应该只是工程细节。

这几乎一定会导致后面踩坑。

因为语言模型不是直接看“自然语言”，它看的是：

- 编码后的文本
- 规范化后的字符流
- tokenizer 切出来的 token 序列
- 被打包成固定长度的训练样本

也就是说，这一卷并不是在讲外围预处理，而是在讲：

> 语言模型怎样定义自己的输入空间与监督对象。

## 这一卷当前包含的章节

- [01. 语料、样本与数据分布](/learning/part-4-text-and-tokenization/01-corpora-samples-and-data-distribution)
- [02. Unicode、字节与文本规范化](/learning/part-4-text-and-tokenization/02-unicode-bytes-and-text-normalization)
- [03. Token、词表与 special token](/learning/part-4-text-and-tokenization/03-tokens-vocabularies-and-special-tokens)
- [04. 子词分词、BPE 与 tokenizer 训练](/learning/part-4-text-and-tokenization/04-subword-tokenization-bpe-and-tokenizer-training)
- [05. 从 token 流到固定长度训练样本](/learning/part-4-text-and-tokenization/05-from-token-streams-to-fixed-length-training-samples)
- [06. 为什么训练目标表现成右移一位](/learning/part-4-text-and-tokenization/06-why-the-objective-looks-like-a-one-token-shift)

## 这一卷的核心主线

它会从外到内回答下面这条链：

1. 训练数据到底来自哪里  
2. 机器底层怎样看见文本  
3. 文本怎样被切成模型能处理的离散单位  
4. token 序列怎样组织成统一长度样本  
5. next-token prediction 怎样在数据层真正落地  

只要这条链没有清楚，后面的训练和生成都会建立在含糊输入定义上。

## 后续还会继续展开的主题

这一卷还会继续补上：

- 文本去重、脏数据与语料偏差
- 词表规模与序列长度之间的权衡
- 文档边界、packing 策略与训练效率
- 多语言文本与 tokenizer 设计之间的关系

这些内容对“小模型从零实现”同样关键，因为很多模型问题本质上并不是模型块写错，而是输入定义错了。
