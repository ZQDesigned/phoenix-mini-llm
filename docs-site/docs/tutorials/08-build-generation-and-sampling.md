---
title: 08. 写生成与采样逻辑
group:
  title: 复刻教程
  order: 0
order: 7
toc: content
---

# 08. 写生成与采样逻辑

## 本章目标

训练链路已经打通，这一章解决“模型如何真正输出文本”。完成后，你应该已经拥有：

- 支持 `temperature`、`top_k`、`top_p` 的采样函数。
- 基于 KV Cache 的自回归生成循环。
- `phoenix-generate` 命令行入口。
- 对采样与生成行为的基本测试。

## 本章对应的仓库文件

- `src/phoenix_mini_llm/inference/sampling.py`
- `src/phoenix_mini_llm/inference/generate.py`
- `src/phoenix_mini_llm/cli/generate.py`
- `tests/inference/test_sampling.py`
- `tests/inference/test_generate.py`

## 第一步：实现采样函数

`sample_next_token()` 的职责是从最后一个位置的 logits 中抽取下一个 token。当前项目支持：

- `temperature`
- `top_k`
- `top_p`

完整实现：

```python
from __future__ import annotations

import torch


def sample_next_token(
    *,
    logits: torch.Tensor,
    temperature: float,
    top_k: int,
    top_p: float,
) -> torch.Tensor:
    if temperature <= 0:
        raise ValueError("temperature must be positive")

    scaled_logits = logits / temperature

    if top_k > 0:
        top_values, _ = torch.topk(scaled_logits, k=min(top_k, scaled_logits.size(-1)), dim=-1)
        cutoff = top_values[..., -1, None]
        scaled_logits = scaled_logits.masked_fill(scaled_logits < cutoff, float("-inf"))

    if 0.0 < top_p < 1.0:
        sorted_logits, sorted_indices = torch.sort(scaled_logits, descending=True, dim=-1)
        sorted_probs = torch.softmax(sorted_logits, dim=-1)
        cumulative = torch.cumsum(sorted_probs, dim=-1)
        remove_mask = cumulative > top_p
        remove_mask[..., 0] = False
        sorted_logits = sorted_logits.masked_fill(remove_mask, float("-inf"))
        scaled_logits = torch.full_like(scaled_logits, float("-inf"))
        scaled_logits.scatter_(dim=-1, index=sorted_indices, src=sorted_logits)

    probabilities = torch.softmax(scaled_logits, dim=-1)
    return torch.multinomial(probabilities, num_samples=1).squeeze(-1)
```

### 这里的设计选择

- `temperature <= 0` 直接报错，不接受偷偷替换成贪心解码。
- `top_k` 先裁剪 logits，再做 softmax。
- `top_p` 通过排序、累计概率、再 scatter 回原索引实现。

## 第二步：写自回归生成函数

当前项目用 `generate_tokens()` 负责逐 token 生成：

```python
from __future__ import annotations

import torch
from torch import nn

from phoenix_mini_llm.inference.sampling import sample_next_token


@torch.no_grad()
def generate_tokens(
    *,
    model: nn.Module,
    prompt_ids: torch.Tensor,
    max_new_tokens: int,
    temperature: float,
    top_k: int,
    top_p: float,
    eos_token_id: int | None = None,
) -> torch.Tensor:
    model.eval()
    device = next(model.parameters()).device
    generated = prompt_ids.to(device)
    past_key_values = None
    current_input = generated

    for _ in range(max_new_tokens):
        output = model(
            input_ids=current_input,
            use_cache=True,
            past_key_values=past_key_values,
        )
        next_token = sample_next_token(
            logits=output.logits[:, -1, :],
            temperature=temperature,
            top_k=top_k,
            top_p=top_p,
        )
        generated = torch.cat([generated, next_token.unsqueeze(-1)], dim=-1)
        past_key_values = output.past_key_values
        current_input = next_token.unsqueeze(-1)
        if eos_token_id is not None and torch.all(next_token == eos_token_id):
            break

    return generated.cpu()
```

### 这里为什么 `current_input` 一开始等于整个 prompt，之后只等于新 token

因为：

- 第一次前向时还没有任何缓存，必须把完整 prompt 喂进去。
- 后续前向已经拿到了 `past_key_values`，此时只需要把新 token 喂进去即可。

这正是 KV Cache 的价值所在。

## 第三步：写 `cli/generate.py`

命令行入口要完成这些步骤：

1. 读配置。
2. 应用 `prepare_metadata.json`。
3. 加载 tokenizer。
4. 构建模型并恢复 checkpoint。
5. 把文本 prompt 编码成 token。
6. 调用 `generate_tokens()`。
7. 解码输出文本。

当前项目还支持通过 `--max-new-tokens` 覆盖配置中的默认生成长度。

## 第四步：给生成逻辑写测试

`tests/inference/test_sampling.py` 主要锁住采样约束：

- `top_k=1` 时只能取最大 logit。
- `top_p` 截断后不能采到阈值外 token。

`tests/inference/test_generate.py` 则检查：

- 输出长度会增长。
- 原始 prompt 前缀不会被破坏。

这些测试不是为了证明“生成文本很聪明”，而是为了证明“接口和约束行为正确”。

## 本章结束后你应该怎么跑

先跑推理层测试：

```bash
uv run pytest tests/inference/test_sampling.py tests/inference/test_generate.py
```

然后用 debug checkpoint 做一次最小生成：

```bash
uv run phoenix-generate --config configs/debug.toml --checkpoint latest --prompt "Once upon a"
```

如果你还没有训练过模型，这条命令输出的文本可能很粗糙，这是正常的。当前阶段你关注的是：

- 命令能跑通。
- tokenizer 编解码链路一致。
- 生成长度和终止条件正确。

## 常见偏差

### 偏差 1：把整段 `generated` 每一步都重新喂给模型

这样虽然也能生成，但你就没有真正使用 KV Cache。

### 偏差 2：解码时把 special tokens 直接暴露给用户

当前项目使用 `tokenizer.decode(..., skip_special_tokens=True)`，否则 `<bos>` / `<eos>` 等符号可能直接出现在输出里。

### 偏差 3：忘记把 prompt 前面补上 `bos_token_id`

当前项目生成入口会把 prompt token 序列前置 `bos`。如果缺这一步，训练分布和推理分布就不一致。

<Callout title="相关学习章节" tone="note">
  如果你对 top-k、top-p、temperature 各自改变的是什么还不稳，回到 [11. 推理与采样](/learning/11-inference-and-sampling)。
</Callout>

## 本章完成后的阶段检查点

```bash
git add .
git commit -m "tutorial-step-08"
```

## 下一章做什么

下一章补齐工程化细节：设备检测、随机种子、日志、脚本包装和完整测试矩阵。到那时，这个项目才会从“能跑”变成“可维护”。
