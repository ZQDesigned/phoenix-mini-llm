---
title: 08. Transformer Block
group:
  title: 学习主线
  order: 0
order: 7
toc: content
---

# 08. Transformer Block

## 这一章要解决什么问题

理解了 Attention 之后，你还需要知道：为什么真实模型不会只堆一层 Attention，而是堆一个个结构完整的 Transformer Block？一个 block 里每个部分都在做什么？

## 你需要先知道什么

- 已理解 self-attention 的基本角色。
- 知道模型需要多层堆叠来形成更强表示。

## 核心概念

### 1. Transformer Block 不是“Attention + 一点别的”

一个 block 通常至少包含：

- 归一化
- Self-attention
- 残差连接
- 前馈网络（FFN / MLP）
- 再一次归一化与残差

如果缺少其中几个，训练稳定性和表达能力都会明显下降。

### 2. 残差连接是在保护信息流

残差连接的形式可以理解成：

\[
x + f(x)
\]

它的作用是：

- 让原始信息更容易跨层传播
- 避免深层网络训练时完全“覆盖掉”前一层表示
- 帮助梯度更稳定地传回去

### 3. 归一化是在稳定尺度

语言模型里常见 LayerNorm 或 RMSNorm。`phoenix-mini-llm` 使用 RMSNorm，它的作用是控制隐藏状态的数值尺度，减少训练过程中的不稳定。

直观上你可以把它理解成：

> 每层都先把数值范围整理一下，再做后续变换。

### 4. FFN 负责对每个位置做更强的非线性变换

Attention 解决的是“看哪里”的问题。FFN 解决的是“看完之后，如何在当前位置内部做更复杂表示变换”的问题。

它通常按位置独立工作，也就是说不会直接跨位置通信，但会提升每个位置的表示能力。

### 5. 多头注意力让模型并行观察不同关系

单头注意力可以找一种相关性，多头注意力允许模型把隐藏维度拆成多个头，让不同头分别学习：

- 局部依赖
- 长程依赖
- 句法模式
- 其他统计关系

## 最小必要数学

### 残差连接

\[
y = x + f(x)
\]

### 多头的基本形态

如果隐藏维度是 `hidden_size`，头数是 `num_heads`，那么每个头的维度通常是：

\[
head\_dim = \frac{hidden\_size}{num\_heads}
\]

这也是为什么很多模型都要求 `hidden_size` 能被 `num_heads` 整除。

## 最小代码实验

下面不是完整实现，只是把 block 的数据流压缩成最小伪代码：

```python
def transformer_block(x):
    attn_out = self_attention(rms_norm_1(x))
    x = x + attn_out

    ffn_out = feed_forward(rms_norm_2(x))
    x = x + ffn_out
    return x
```

这段流程表达了两个核心事实：

1. Attention 和 FFN 都不是直接替换 `x`，而是通过残差叠加回去。
2. 归一化通常先于核心计算发生。

## 常见误区

### 误区 1：Attention 已经足够复杂，不需要 FFN

Attention 负责跨位置读信息，但如果没有 FFN，每个位置内部的非线性表达能力会不足。

### 误区 2：残差只是“为了照着论文写”

不是。它对深层训练稳定性非常关键。很多网络如果去掉残差，虽然形式上仍然可运行，但训练会明显变差。

### 误区 3：多头注意力一定意味着每个头都学到完全不同知识

不一定。多头提供的是表达容量，不保证每个头都各司其职。但实践上，它确实让模型更容易学习多种关系模式。

<Callout title="和当前实现的对应关系" tone="note">
  你后面在源码里会看到 `TransformerBlock`、`RMSNorm`、RoPE、KV cache 等模块。理解 block 的职责分工之后，再读这些实现会轻松很多。
</Callout>

## 练习题

1. 为什么 Transformer Block 里既需要 Attention，也需要 FFN？
2. 残差连接如何帮助深层模型训练？
3. 为什么 `hidden_size` 必须能被 `num_heads` 整除？

## 下一章会用到什么

下一章会从“一个 block”继续推进到“整个模型”：embedding、block 堆叠、最终输出层和参数规模估算。
