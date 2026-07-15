---
title: 06. 拼出 phoenix-mini-llm 主模型
group:
  title: 复刻教程
  order: 0
order: 5
toc: content
---

import { Callout } from '../../src/components/Callout';

# 06. 拼出 phoenix-mini-llm 主模型

## 本章目标

把上一章的 block 级模块组装成完整的 decoder-only 模型：embedding、block 堆叠、final norm、lm head、loss 计算和可选 cache 输出。完成后你应该拥有 `PhoenixMiniLM` 以及标准化的 `ModelOutput`。

## 你将新增或修改哪些文件

```text
src/phoenix_mini_llm/models/transformer.py
src/phoenix_mini_llm/models/__init__.py
tests/models/test_transformer.py
src/phoenix_mini_llm/config.py
```

## 推荐实现顺序

1. 定义 `ModelOutput` 数据结构。
2. 写 `PhoenixMiniLM.__init__()`，组装 embedding、blocks、final norm、lm head。
3. 写 `forward()`，支持 `targets`、`use_cache` 和 `past_key_values`。
4. 加上 weight tying 和初始化逻辑。
5. 回过头补 `tests/models/test_transformer.py` 的覆盖。

## 关键实现解释

### 1. forward 的职责不能含糊

你的 `forward()` 至少要支持这些路径：

- 只有 `input_ids`：返回 logits
- `input_ids + targets`：返回 logits 和 loss
- `use_cache=True`：返回可继续生成的 `past_key_values`

### 2. lm head 和 token embedding 可以共用权重

这一步在代码上通常是一句：

```python
self.lm_head.weight = self.token_embeddings.weight
```

它的好处是减少参数量，并让输入和输出词表映射保持一致的表示基础。

### 3. loss 计算应该在模型内部完成还是外部完成

在这个项目里，选择在模型内部支持 `targets` -> `loss` 的路径，有两个好处：

- 训练循环更简洁
- 测试更容易围绕 `ModelOutput` 做断言

## 你应当能写出的骨架

```python
class PhoenixMiniLM(nn.Module):
    def __init__(self, config: ModelConfig) -> None:
        ...

    def forward(
        self,
        input_ids: torch.Tensor,
        targets: torch.Tensor | None = None,
        use_cache: bool = False,
        past_key_values: PastKeyValues | None = None,
    ) -> ModelOutput:
        ...
```

## 常见错误

- `targets` 展平方式不对，导致 cross-entropy 比较错位。
- 开启 `use_cache` 后没有把各层的 present states 收集回去。
- logits shape 正确，但 loss 计算用的 target 对齐错了。

<Callout title="相关学习章节" tone="note">
  如果你对整条前向路径的职责分工还不稳，回看 [09. 把模型拼起来](/learning/09-assembling-the-model)。
</Callout>

## 本章完成后如何检查

1. `forward()` 在有无 `targets` 时都能返回结构一致的 `ModelOutput`。
2. `tests/models/test_transformer.py` 可以验证 logits shape 与 loss 存在性。
3. 模型能够接受 `past_key_values` 并返回更新后的 cache。

## 建议本地检查点名称

`tutorial-step-06`
