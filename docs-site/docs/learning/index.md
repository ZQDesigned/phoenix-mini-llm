---
title: 学习主线总览
nav:
  title: 学习主线
  order: 1
toc: content
---

import { Callout } from '../../src/components/Callout';

# 学习主线总览

这一部分是一套严格按顺序阅读的线性教材。它不是术语索引，也不是项目 API 参考，而是专门为第一次做这类项目的读者准备的学习路径。

## 你会按照什么顺序学习

1. 先弄清楚语言模型项目到底在解决什么问题。
2. 再建立最基本的工程环境和张量直觉。
3. 接着理解数据、Tokenizer、训练目标和 Attention。
4. 最后把模型拼起来，并补上训练工程、推理与调试。

## 读前要求

- 会使用终端。
- 知道 Python 基本语法和函数、类的概念。
- 不要求你提前学过机器学习，也不要求你先懂 Transformer 论文。

<Callout title="怎么读这一部分" tone="note">
  不建议跳读。后面的章节会默认你已经理解前面的张量、损失函数、Token 和 Attention 基础。如果你只是浏览标题，很容易在复刻阶段出现“术语看过，但代码不会写”的问题。
</Callout>

## 12 章目录

1. [01. 你到底在做什么](/learning/01-what-you-are-building)
2. [02. Python 环境与 uv](/learning/02-python-environment-and-uv)
3. [03. Tensor 与线性代数直觉](/learning/03-tensors-and-linear-algebra)
4. [04. 自动求导与训练闭环](/learning/04-autograd-and-training-loop)
5. [05. 从文本到 Token](/learning/05-text-to-tokens)
6. [06. 语言模型训练目标](/learning/06-language-modeling-objective)
7. [07. 从 MLP 到 Attention](/learning/07-from-mlp-to-attention)
8. [08. Transformer Block](/learning/08-transformer-blocks)
9. [09. 把模型拼起来](/learning/09-assembling-the-model)
10. [10. 训练工程](/learning/10-training-engineering)
11. [11. 推理与采样](/learning/11-inference-and-sampling)
12. [12. 调试与评估](/learning/12-debugging-and-evaluation)

## 这一部分和复刻教程是什么关系

- `学习主线`负责让你理解为什么要这样设计。
- `复刻教程`负责让你亲手把这些设计变成代码。

如果你只想尽快开工，至少先读完 `01` 到 `08` 章，再进入 [复刻教程](/tutorials)。
