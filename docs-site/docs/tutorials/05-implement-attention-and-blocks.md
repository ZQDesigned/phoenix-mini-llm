---
title: 05. 实现 Attention 与 Transformer Block
group:
  title: 复刻教程
  order: 0
order: 4
toc: content
---

# 05. 实现 Attention 与 Transformer Block

## 本章目标

把语言模型的核心结构搭起来：RMSNorm、RoPE、KV cache 类型定义、多头 self-attention 和 Transformer Block。完成后你应该拥有能通过 shape 与 cache 测试的核心模块。

## 你将新增或修改哪些文件

```text
src/phoenix_mini_llm/models/layers.py
src/phoenix_mini_llm/models/rope.py
src/phoenix_mini_llm/models/cache.py
tests/models/test_transformer.py
tests/models/test_cache.py
```

## 推荐实现顺序

1. 先定义 `PastKeyValues` 相关类型。
2. 写 RMSNorm 和基础前馈层。
3. 写 rotary positional embedding 的辅助函数。
4. 实现 causal self-attention。
5. 最后组装成 `TransformerBlock`。

## 为什么这样拆

如果你把所有逻辑一股脑塞进 `transformer.py`，后果通常是：

- shape bug 很难定位
- cache 行为难以单测
- 你自己都很难分辨“是 RoPE 错了还是 mask 错了”

把 block 拆成子模块，是为了让你能按职责读、按职责测。

## 关键实现要求

### 1. `hidden_size` 必须能被 `num_heads` 整除

这是多头拆分的前提。这个检查最好尽早放进配置或模块初始化阶段。

### 2. cache 行为必须可测试

当 `use_cache=True` 时，你至少需要验证：

- 返回了 `past_key_values`
- 新 token 进来时 cache 长度会增长

### 3. attention 一定要保持 causal 约束

不要因为测试只看 shape 就忽略 mask。否则模型会在训练时偷看未来 token。

## 最小阅读顺序建议

如果你在这一章容易迷失，按这个顺序读自己写的代码：

1. `RMSNorm`
2. `apply_rope(...)`
3. `CausalSelfAttention`
4. `TransformerBlock`

## 常见错误

- 只检查 forward 能跑，不检查 cache 行为。
- `hidden_size / num_heads` 不是整数。
- causal mask 写错，导致模型能看见未来位置。

<Callout title="相关学习章节" tone="warning">
  如果你对 Attention 或 Transformer Block 的职责分工还不够清楚，先回去补 [07. 从 MLP 到 Attention](/learning/07-from-mlp-to-attention) 和 [08. Transformer Block](/learning/08-transformer-blocks)。
</Callout>

## 本章完成后如何检查

1. `tests/models/test_transformer.py` 能验证输出 shape 和 loss 结构。
2. `tests/models/test_cache.py` 能验证 cache 追加行为。
3. 你能画出 block 的数据流：norm -> attention -> residual -> norm -> ffn -> residual。

## 建议本地检查点名称

`tutorial-step-05`
