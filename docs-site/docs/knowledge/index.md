---
title: 知识档案总览
nav:
  title: 知识档案
  order: 1
toc: content
---

# 知识档案总览

这一部分是给初学者的顺序化阅读材料。目标不是把所有机器学习理论都塞进去，而是只覆盖你完整读懂并复刻 `phoenix-mini-llm` 所必需的基础知识。

## 建议阅读顺序

1. [Python、uv 与工程习惯](/knowledge/python-and-uv)
2. [Tensor 与自动求导](/knowledge/tensors-and-autograd)
3. [文本数据与 Tokenizer](/knowledge/data-and-tokenization)
4. [Transformer 基础](/knowledge/transformer-basics)
5. [本项目模型设计](/knowledge/modeling-phoenix-mini-llm)
6. [训练与优化](/knowledge/training-and-optimization)
7. [推理与采样](/knowledge/inference-and-sampling)
8. [跨平台工程实践](/knowledge/cross-platform-engineering)
9. [评估、排错与下一步](/knowledge/evaluation-and-debugging)

## 读完之后你应该具备什么能力

- 知道为什么这个项目要用 BPE tokenizer，而不是直接做字符级建模。
- 能解释 decoder-only Transformer 的前向过程、mask、loss 和 KV cache。
- 能看懂 `prepare_data`、`train`、`evaluate`、`generate` 这四条脚本链路。
- 能自己修改 `configs/*.toml`，调整数据规模、模型规模和训练步数。
- 能在 macOS 上做开发验证，在 Windows CUDA 上做正式训练。
