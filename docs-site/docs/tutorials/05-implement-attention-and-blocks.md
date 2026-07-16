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

这一章开始写真正的模型核心。完成后，你应该已经有：

- `PastKeyValue` / `PastKeyValues` 类型别名。
- Rotary Positional Embedding 的缓存构造与应用函数。
- `RMSNorm`、`SwiGLUFeedForward`。
- 支持因果掩码和 KV Cache 的 `CausalSelfAttention`。
- 一个前归一化的 `TransformerBlock`。

写完这一章后，你还没有完整语言模型，但已经有了最难写、也最容易引入数值错误的部分。

## 本章对应的仓库文件

- `src/phoenix_mini_llm/models/cache.py`
- `src/phoenix_mini_llm/models/rope.py`
- `src/phoenix_mini_llm/models/layers.py`

## 第一步：定义 KV Cache 类型

缓存类型先不要搞复杂。当前项目只用最直接的表示：

```python
from __future__ import annotations

from typing import TypeAlias

import torch

PastKeyValue: TypeAlias = tuple[torch.Tensor, torch.Tensor]
PastKeyValues: TypeAlias = list[PastKeyValue]
```

这意味着每一层的缓存就是一个 `(key, value)` 元组，而完整模型缓存就是按层排列的列表。

## 第二步：写 `rope.py`

RoPE 的职责是给 query / key 注入相对位置信息。你需要两个函数：

- `build_rope_cache()`
- `apply_rope()`

最终实现：

```python
from __future__ import annotations

import torch


def build_rope_cache(
    sequence_length: int,
    head_dim: int,
    device: torch.device,
    theta: float,
) -> tuple[torch.Tensor, torch.Tensor]:
    if head_dim % 2 != 0:
        raise ValueError("head_dim must be even for rotary embeddings")

    positions = torch.arange(sequence_length, device=device, dtype=torch.float32)
    frequencies = 1.0 / (
        theta ** (torch.arange(0, head_dim, 2, device=device, dtype=torch.float32) / head_dim)
    )
    angles = torch.outer(positions, frequencies)
    cos = torch.cos(angles)
    sin = torch.sin(angles)
    return cos, sin


def apply_rope(
    tensor: torch.Tensor,
    cos: torch.Tensor,
    sin: torch.Tensor,
    offset: int = 0,
) -> torch.Tensor:
    query_length = tensor.shape[-2]
    cos = cos[offset : offset + query_length].unsqueeze(0).unsqueeze(0)
    sin = sin[offset : offset + query_length].unsqueeze(0).unsqueeze(0)

    left = tensor[..., ::2]
    right = tensor[..., 1::2]
    rotated = torch.stack(
        (
            left * cos - right * sin,
            left * sin + right * cos,
        ),
        dim=-1,
    )
    return rotated.flatten(start_dim=-2)
```

### 这里最容易写错的点

- `head_dim` 必须是偶数，因为偶数位和奇数位成对旋转。
- `offset` 是给 KV Cache 用的。如果你在增量生成时不考虑历史长度，RoPE 的位置就会错位。
- `cos` / `sin` 的广播维度必须对齐到 `[1, 1, seq, head_dim/2]`。

## 第三步：写基础层 `RMSNorm` 和 `SwiGLUFeedForward`

这两个模块最终都在 `models/layers.py` 中：

```python
class RMSNorm(nn.Module):
    def __init__(self, hidden_size: int, eps: float) -> None:
        super().__init__()
        self.weight = nn.Parameter(torch.ones(hidden_size))
        self.eps = eps

    def forward(self, inputs: torch.Tensor) -> torch.Tensor:
        variance = inputs.pow(2).mean(dim=-1, keepdim=True)
        normalized = inputs * torch.rsqrt(variance + self.eps)
        return normalized * self.weight


class SwiGLUFeedForward(nn.Module):
    def __init__(self, hidden_size: int, intermediate_size: int, dropout: float) -> None:
        super().__init__()
        self.gate_proj = nn.Linear(hidden_size, intermediate_size, bias=False)
        self.value_proj = nn.Linear(hidden_size, intermediate_size, bias=False)
        self.out_proj = nn.Linear(intermediate_size, hidden_size, bias=False)
        self.dropout = nn.Dropout(dropout)

    def forward(self, inputs: torch.Tensor) -> torch.Tensor:
        gated = torch.nn.functional.silu(self.gate_proj(inputs)) * self.value_proj(inputs)
        return self.dropout(self.out_proj(gated))
```

### 为什么这里用 RMSNorm 而不是 LayerNorm

因为当前项目要对齐一类现代 decoder-only 架构的实现习惯：

- 结构更简洁。
- 不需要减均值。
- 与后面前归一化残差路径更一致。

## 第四步：实现 `CausalSelfAttention`

这是本章最核心的部分。它必须同时满足这些要求：

- 输入输出 shape 正确。
- 每个 head 的维度切分正确。
- Query / Key 使用 RoPE。
- 训练时使用因果掩码。
- 推理时支持把过去的 key/value 接回来。

当前项目的完整实现如下：

```python
class CausalSelfAttention(nn.Module):
    def __init__(
        self,
        hidden_size: int,
        num_heads: int,
        max_seq_len: int,
        rope_theta: float,
        dropout: float,
    ) -> None:
        super().__init__()
        self.hidden_size = hidden_size
        self.num_heads = num_heads
        self.max_seq_len = max_seq_len
        self.head_dim = hidden_size // num_heads
        self.rope_theta = rope_theta

        self.q_proj = nn.Linear(hidden_size, hidden_size, bias=False)
        self.k_proj = nn.Linear(hidden_size, hidden_size, bias=False)
        self.v_proj = nn.Linear(hidden_size, hidden_size, bias=False)
        self.out_proj = nn.Linear(hidden_size, hidden_size, bias=False)
        self.dropout = nn.Dropout(dropout)

    def forward(
        self,
        inputs: torch.Tensor,
        past_key_value: PastKeyValue | None = None,
        use_cache: bool = False,
    ) -> tuple[torch.Tensor, PastKeyValue | None]:
        batch_size, query_length, _ = inputs.shape
        past_length = 0 if past_key_value is None else past_key_value[0].shape[-2]
        total_length = past_length + query_length
        if total_length > self.max_seq_len:
            raise ValueError("sequence length exceeds configured max_seq_len")

        query = self._reshape(self.q_proj(inputs), batch_size, query_length)
        key = self._reshape(self.k_proj(inputs), batch_size, query_length)
        value = self._reshape(self.v_proj(inputs), batch_size, query_length)

        cos, sin = build_rope_cache(
            sequence_length=total_length,
            head_dim=self.head_dim,
            device=inputs.device,
            theta=self.rope_theta,
        )
        query = apply_rope(query, cos=cos, sin=sin, offset=past_length)
        key = apply_rope(key, cos=cos, sin=sin, offset=past_length)

        if past_key_value is not None:
            key = torch.cat([past_key_value[0], key], dim=-2)
            value = torch.cat([past_key_value[1], value], dim=-2)

        attention_scores = torch.matmul(query, key.transpose(-1, -2)) / math.sqrt(self.head_dim)
        attention_scores = attention_scores.masked_fill(
            self._causal_mask(
                query_length=query_length,
                key_length=key.shape[-2],
                past_length=past_length,
                device=inputs.device,
            ),
            torch.finfo(attention_scores.dtype).min,
        )
        attention_weights = torch.softmax(attention_scores, dim=-1, dtype=torch.float32).to(
            attention_scores.dtype
        )
        attention_output = torch.matmul(self.dropout(attention_weights), value)
        attention_output = attention_output.transpose(1, 2).contiguous().view(
            batch_size,
            query_length,
            self.hidden_size,
        )
        present = (key, value) if use_cache else None
        return self.out_proj(attention_output), present
```

### 这段实现里最重要的三件事

1. `past_length` 必须参与 RoPE 偏移和因果掩码计算。
2. `softmax` 先在 `float32` 中做，再 cast 回原 dtype，更稳。
3. 输出前要把 `[batch, heads, seq, head_dim]` 重新转回 `[batch, seq, hidden]`。

### 因果掩码怎么写

当前项目没有预先构建一个全局布尔矩阵，而是按当前 query 长度和 key 长度现场生成：

```python
def _causal_mask(
    self,
    query_length: int,
    key_length: int,
    past_length: int,
    device: torch.device,
) -> torch.Tensor:
    query_positions = torch.arange(query_length, device=device).unsqueeze(-1)
    key_positions = torch.arange(key_length, device=device).unsqueeze(0)
    invalid = key_positions > (query_positions + past_length)
    return invalid.unsqueeze(0).unsqueeze(0)
```

这个写法的好处是直接兼容增量生成。

## 第五步：实现 `TransformerBlock`

当前项目使用前归一化结构：

```python
class TransformerBlock(nn.Module):
    def __init__(
        self,
        hidden_size: int,
        num_heads: int,
        intermediate_size: int,
        max_seq_len: int,
        rope_theta: float,
        rms_norm_eps: float,
        dropout: float,
    ) -> None:
        super().__init__()
        self.attn_norm = RMSNorm(hidden_size, rms_norm_eps)
        self.ffn_norm = RMSNorm(hidden_size, rms_norm_eps)
        self.attention = CausalSelfAttention(
            hidden_size=hidden_size,
            num_heads=num_heads,
            max_seq_len=max_seq_len,
            rope_theta=rope_theta,
            dropout=dropout,
        )
        self.feed_forward = SwiGLUFeedForward(hidden_size, intermediate_size, dropout)

    def forward(
        self,
        inputs: torch.Tensor,
        past_key_value: PastKeyValue | None = None,
        use_cache: bool = False,
    ) -> tuple[torch.Tensor, PastKeyValue | None]:
        attn_output, present = self.attention(
            self.attn_norm(inputs),
            past_key_value=past_key_value,
            use_cache=use_cache,
        )
        hidden = inputs + attn_output
        ffn_output = self.feed_forward(self.ffn_norm(hidden))
        return hidden + ffn_output, present
```

## 本章结束后如何做最小验证

你现在还没有完整语言模型，但可以先做 shape 级检查：

```bash
uv run python - <<'PY'
import torch

from phoenix_mini_llm.models.layers import TransformerBlock

block = TransformerBlock(
    hidden_size=32,
    num_heads=4,
    intermediate_size=128,
    max_seq_len=16,
    rope_theta=10000.0,
    rms_norm_eps=1e-5,
    dropout=0.0,
)

x = torch.randn(2, 8, 32)
y, cache = block(x, use_cache=True)
print(y.shape)
print(cache[0].shape, cache[1].shape)
PY
```

如果实现正确，你应该看到：

- 输出 hidden shape 仍是 `[2, 8, 32]`
- key/value cache 的时间维长度为 `8`

## 常见偏差

### 偏差 1：忘记在 KV Cache 情况下更新 `total_length`

这样 RoPE 与掩码都会错，生成阶段通常会立刻表现出异常重复或 shape 错误。

### 偏差 2：`view()` 之前没有 `contiguous()`

在 `transpose` 之后直接 `view()` 很容易得到内存布局错误。

### 偏差 3：`hidden_size` 不能被 `num_heads` 整除却没有及早报错

这种错误应该尽量在 `ModelConfig.__post_init__()` 和 attention 初始化阶段就暴露，而不是等到前向时随机炸掉。

> **相关学习章节**
>
>   如果你对为什么要先有 Attention 再有完整模型还不够稳，回到 [07. 从 MLP 到 Attention](/learning/07-from-mlp-to-attention) 和 [08. Transformer Block](/learning/08-transformer-blocks)。

## 本章完成后的阶段检查点

```bash
git add .
git commit -m "tutorial-step-05"
```

## 下一章做什么

下一章把这些砖块真正组装成 `PhoenixMiniLM`，包括词嵌入、残差堆叠、最终归一化、权重共享和 loss 计算。
