---
title: 4. Transformer 基础
group:
  title: 模型
  order: 2
order: 4
toc: content
---

# 4. Transformer 基础

## decoder-only 结构在做什么

`phoenix-mini-llm` 是典型的 decoder-only Transformer。它的目标是：

> 给定前面的 token，预测下一个 token 的概率分布。

## 最小组成模块

### Embedding

把 token id 映射成稠密向量。

### Causal Self-Attention

让当前位置看见“过去”，但看不见“未来”。

### RMSNorm

和 LayerNorm 类似，但形式更简单，是现代小型 LLM 常见选择。

### SwiGLU

比普通 MLP 更常见于现代模型，实现也不复杂。

## 为什么要有 causal mask

训练语言模型时，位置 `t` 只能使用 `0..t` 的信息。如果位置 `t` 偷看了 `t+1` 之后的 token，loss 会虚假变低，但模型学不到真实的自回归能力。

## 为什么要有 RoPE

模型不能只知道“有哪些 token”，还要知道“它们在什么位置”。RoPE 的优点是：

- 实现相对简单
- 适合自回归模型
- 推理时和 KV cache 结合自然

## 你要能说清楚的前向过程

1. `input_ids` 进入 embedding
2. 每层先做 attention 分支
3. 再做 feed-forward 分支
4. 最后经过 norm 和 `lm_head`
5. 输出 `logits`

只要你能顺着这五步读懂代码，就已经跨过了“只能背概念”的阶段。
