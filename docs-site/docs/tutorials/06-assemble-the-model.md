---
title: 06. 拼出主模型
group:
  title: 复刻教程
  order: 0
order: 5
toc: content
---

# 06. 拼出主模型

## 本章目标

前一章你已经有了 Block 级别的砖块，这一章要把它们组装成真正的语言模型 `PhoenixMiniLM`。完成后，你应该拥有：

- 完整的 `ModelOutput` 数据结构。
- 词嵌入、Block 堆叠、最终 RMSNorm 与输出头。
- 输入嵌入和 `lm_head` 权重共享。
- 训练时的 `cross_entropy` loss 计算。
- 推理时可选的 `past_key_values` 返回。
- 覆盖前向、因果性和 KV Cache 的模型测试。

## 本章对应的仓库文件

- `src/phoenix_mini_llm/models/transformer.py`
- `src/phoenix_mini_llm/models/__init__.py`
- `tests/models/test_transformer.py`
- `tests/models/test_cache.py`

## 第一步：定义模型输出对象

不要让模型随手返回一个匿名 tuple。当前项目把输出明确包装成：

```python
from dataclasses import dataclass

import torch

from phoenix_mini_llm.models.cache import PastKeyValues


@dataclass(slots=True)
class ModelOutput:
    logits: torch.Tensor
    loss: torch.Tensor | None = None
    past_key_values: PastKeyValues | None = None
```

这样训练、评估、推理三个阶段都能稳定地按名字取值。

## 第二步：写 `PhoenixMiniLM`

当前项目的完整主模型结构如下：

```python
from __future__ import annotations

from dataclasses import dataclass

import torch
from torch import nn

from phoenix_mini_llm.config import ModelConfig
from phoenix_mini_llm.models.cache import PastKeyValues
from phoenix_mini_llm.models.layers import RMSNorm, TransformerBlock


class PhoenixMiniLM(nn.Module):
    def __init__(self, config: ModelConfig) -> None:
        super().__init__()
        self.config = config
        self.token_embeddings = nn.Embedding(config.vocab_size, config.hidden_size)
        self.dropout = nn.Dropout(config.dropout)
        self.blocks = nn.ModuleList(
            [
                TransformerBlock(
                    hidden_size=config.hidden_size,
                    num_heads=config.num_heads,
                    intermediate_size=config.intermediate_size,
                    max_seq_len=config.max_seq_len,
                    rope_theta=config.rope_theta,
                    rms_norm_eps=config.rms_norm_eps,
                    dropout=config.dropout,
                )
                for _ in range(config.num_layers)
            ]
        )
        self.final_norm = RMSNorm(config.hidden_size, config.rms_norm_eps)
        self.lm_head = nn.Linear(config.hidden_size, config.vocab_size, bias=False)
        self.lm_head.weight = self.token_embeddings.weight
        self.apply(self._init_weights)

    def forward(
        self,
        input_ids: torch.Tensor,
        targets: torch.Tensor | None = None,
        use_cache: bool = False,
        past_key_values: PastKeyValues | None = None,
    ) -> ModelOutput:
        if input_ids.ndim != 2:
            raise ValueError("input_ids must have shape [batch, sequence]")

        hidden = self.dropout(self.token_embeddings(input_ids))
        next_past: PastKeyValues | None = [] if use_cache else None

        for layer_index, block in enumerate(self.blocks):
            layer_past = None if past_key_values is None else past_key_values[layer_index]
            hidden, present = block(hidden, past_key_value=layer_past, use_cache=use_cache)
            if next_past is not None and present is not None:
                next_past.append(present)

        logits = self.lm_head(self.final_norm(hidden))
        loss = None
        if targets is not None:
            loss = torch.nn.functional.cross_entropy(
                logits.view(-1, logits.size(-1)),
                targets.view(-1),
            )
        return ModelOutput(logits=logits, loss=loss, past_key_values=next_past)

    def _init_weights(self, module: nn.Module) -> None:
        if isinstance(module, nn.Linear | nn.Embedding):
            nn.init.normal_(module.weight, mean=0.0, std=0.02)
```

## 第三步：理解这里的关键设计

### 1. 权重共享

```python
self.lm_head.weight = self.token_embeddings.weight
```

这表示输入嵌入矩阵和输出投影矩阵共享权重。对小模型来说，这能减少参数量，也更贴近很多现代语言模型的常见实现。

### 2. `input_ids` 必须是二维张量

这里显式要求 shape 为 `[batch, sequence]`，是为了尽早拦截错误输入。不要等到 embedding 或 attention 深处再爆出难以阅读的异常。

### 3. `use_cache` 决定是否收集 `past_key_values`

- 训练时通常不需要缓存。
- 生成时则希望保留每层历史 key/value，避免每次重算整段 prompt。

### 4. loss 计算放在模型内部

当前项目不是把 loss 逻辑散落到多个训练脚本里，而是让模型在拿到 `targets` 时直接返回 `loss`。这样训练、评估、调试路径都统一。

## 第四步：补上模型测试

当主模型成形后，就可以开始用正式测试确保行为稳定。`tests/models/test_transformer.py` 至少要验证前向 shape 和 loss：

```python
from __future__ import annotations

import torch

from phoenix_mini_llm.config import ModelConfig
from phoenix_mini_llm.models.transformer import PhoenixMiniLM


def build_model_config() -> ModelConfig:
    return ModelConfig(
        hidden_size=32,
        num_layers=2,
        num_heads=4,
        intermediate_size=128,
        max_seq_len=16,
        dropout=0.0,
        rope_theta=10_000.0,
        rms_norm_eps=1e-5,
        vocab_size=64,
        pad_token_id=0,
        bos_token_id=1,
        eos_token_id=2,
    )


def test_forward_returns_logits_and_loss() -> None:
    torch.manual_seed(0)
    model = PhoenixMiniLM(build_model_config())
    input_ids = torch.randint(0, 64, (2, 8))
    targets = torch.randint(0, 64, (2, 8))

    output = model(input_ids=input_ids, targets=targets)

    assert output.logits.shape == (2, 8, 64)
    assert output.loss is not None
    assert output.loss.ndim == 0
```

同一个文件里还应验证因果性：

```python
def test_forward_is_causal_for_prefix_positions() -> None:
    torch.manual_seed(0)
    model = PhoenixMiniLM(build_model_config())
    model.eval()
    prefix = torch.tensor([[1, 5, 9, 3, 7]])
    changed_suffix = torch.tensor([[1, 5, 9, 4, 2]])

    first = model(input_ids=prefix).logits
    second = model(input_ids=changed_suffix).logits

    torch.testing.assert_close(first[:, :3], second[:, :3])
```

这条测试很重要，因为它验证了“后续 token 变化不会污染前缀位置的输出”。

## 第五步：验证 KV Cache 行为

`tests/models/test_cache.py` 主要检查缓存是不是按时间增长：

```python
def test_kv_cache_grows_for_incremental_generation() -> None:
    torch.manual_seed(0)
    model = PhoenixMiniLM(build_model_config())
    model.eval()

    first_output = model(input_ids=torch.tensor([[1, 2, 3]]), use_cache=True)
    second_output = model(
        input_ids=torch.tensor([[4]]),
        use_cache=True,
        past_key_values=first_output.past_key_values,
    )

    assert first_output.past_key_values is not None
    assert second_output.past_key_values is not None
    assert first_output.past_key_values[0][0].shape[-2] == 3
    assert second_output.past_key_values[0][0].shape[-2] == 4
    assert second_output.logits.shape == (1, 1, 64)
```

如果这条测试失败，通常意味着：

- KV Cache 拼接维度错了。
- RoPE offset 没考虑历史长度。
- `current_input` 和 `past_key_values` 的接口设计有问题。

## 本章结束后怎么验证

运行模型测试：

```bash
uv run pytest tests/models/test_transformer.py tests/models/test_cache.py
```

再做一个手工前向检查：

```bash
uv run python - <<'PY'
import torch

from phoenix_mini_llm.config import ModelConfig
from phoenix_mini_llm.models.transformer import PhoenixMiniLM

config = ModelConfig(
    hidden_size=32,
    num_layers=2,
    num_heads=4,
    intermediate_size=128,
    max_seq_len=16,
    dropout=0.0,
    rope_theta=10000.0,
    rms_norm_eps=1e-5,
    vocab_size=64,
    pad_token_id=0,
    bos_token_id=1,
    eos_token_id=2,
)

model = PhoenixMiniLM(config)
output = model(
    input_ids=torch.randint(0, 64, (2, 8)),
    targets=torch.randint(0, 64, (2, 8)),
)
print(output.logits.shape)
print(output.loss)
PY
```

## 常见偏差

### 偏差 1：没有共享 `lm_head` 和 embedding 权重

这不会让模型马上跑不起来，但会和当前仓库的参数结构不一致。

### 偏差 2：在模型外部计算 loss

这会让训练和评估入口都重复写一遍 loss 逻辑，后续更难统一。

### 偏差 3：`past_key_values` 的层次结构设计不清楚

如果你把它设计成单层 tuple、字典或混合结构，后面生成阶段几乎一定会变得混乱。

> **相关学习章节**
>
>   如果你还不确定为什么输出头要接在 final norm 之后，回到 [09. 把模型拼起来](/learning/09-assembling-the-model)。

## 本章完成后的阶段检查点

```bash
git add .
git commit -m "tutorial-step-06"
```

## 下一章做什么

下一章把模型接入真正的训练工程：优化器、学习率调度器、checkpoint、训练入口和评估入口都会在那一章补齐。
