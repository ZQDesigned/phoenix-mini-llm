---
title: 08. 写生成与采样逻辑
group:
  title: 复刻教程
  order: 0
order: 7
toc: content
---

import { Callout } from '../../src/components/Callout';

# 08. 写生成与采样逻辑

## 本章目标

让训练好的模型真正能从 prompt 生成文本，并且把采样决策拆成可测试的独立模块。完成后你应该拥有：

- `sample_next_token(...)`
- `generate_tokens(...)`
- `phoenix-generate` 命令

## 你将新增或修改哪些文件

```text
src/phoenix_mini_llm/inference/sampling.py
src/phoenix_mini_llm/inference/generate.py
src/phoenix_mini_llm/cli/generate.py
tests/inference/test_sampling.py
tests/inference/test_generate.py
```

## 推荐实现顺序

1. 先单独写 `sample_next_token()`。
2. 给它补 temperature、top-k、top-p 的测试。
3. 再写滚动生成函数，接入 `past_key_values`。
4. 最后写 CLI，把 prompt、checkpoint 和生成配置接起来。

## 为什么采样函数要单独拆出来

因为采样是最容易被“凭感觉”调整的部分。单独拆出来的好处是：

- 可以单测温度和截断行为
- 可以在不碰生成循环的情况下改采样策略
- debug 时更容易判断问题来自模型本身，还是采样决策

## 关键实现要求

### 1. 生成函数必须滚动输入

完整流程应该是：

1. 先用 prompt 跑第一轮前向
2. 取最后一个位置的 logits
3. 采样出下一 token
4. 把这个新 token 作为下一轮输入
5. 重复直到达到长度上限或碰到 `eos`

### 2. 优先支持 `past_key_values`

如果你的模型已经支持 cache，这一章就应该把它真正用起来，否则长文本生成会重复计算历史上下文。

## 关键命令

```bash
uv run phoenix-generate \
  --config configs/debug.toml \
  --checkpoint latest \
  --prompt "Once upon a time"
```

## 常见错误

- 直接对未经处理的 logits 乱采样，忽略温度和截断策略。
- 生成循环里每次都把完整历史重新送进模型，却没有用 cache。
- prompt 编码和生成后解码没有复用同一个 tokenizer。

<Callout title="相关学习章节" tone="note">
  如果你还不确定 greedy、temperature、top-k 和 top-p 的职责分工，先回看 [11. 推理与采样](/learning/11-inference-and-sampling)。
</Callout>

## 本章完成后如何检查

1. `tests/inference/test_sampling.py` 覆盖基本采样行为。
2. `tests/inference/test_generate.py` 覆盖最小生成流程。
3. `phoenix-generate` 能从 checkpoint 读出模型并输出文本。

## 建议本地检查点名称

`tutorial-step-08`
