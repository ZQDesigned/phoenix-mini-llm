---
title: 3. 文本数据与 Tokenizer
group:
  title: 数据与表示
  order: 1
order: 3
toc: content
---

# 3. 文本数据与 Tokenizer

## 为什么不能把原始字符串直接喂给模型

神经网络处理的是数值。文本必须先变成 token id，才能进入 embedding 层。

## 为什么选 TinyStories

这个项目使用 [TinyStories](https://huggingface.co/datasets/roneneldan/TinyStories) 作为起点，原因很直接：

- 文本短，适合小上下文
- 语言风格一致，适合学习型训练
- 对小模型更友好
- 很容易做子集实验

## 为什么选 BPE 而不是字符级

字符级建模最容易实现，但不够接近现代 LLM。BPE 更有代表性，因为它能：

- 比字符级更高效
- 保留一定的子词结构
- 让词表规模保持在可控范围

## 本项目的数据准备链路

1. 从 Hugging Face 下载 TinyStories 的训练/验证子集
2. 做最小文本规范化
3. 用训练集文本训练 BPE tokenizer
4. 用 tokenizer 把文本编码成 token id
5. 给每条样本加上 `<bos>` 和 `<eos>`
6. 把 token 流打包成固定长度训练块

## 为什么要“打包”而不是逐故事训练

如果每个故事长度都不一样，DataLoader 和训练循环会复杂很多。对于学习项目，把 token 流整理成固定大小块通常更简单：

- 输入张量形状稳定
- 训练代码更直观
- 容易做移位目标 `x -> y`

本项目里，每一行 packed tokens 的长度是 `max_seq_len + 1`。这样就能自然拆成：

- `input_ids = row[:-1]`
- `targets = row[1:]`
