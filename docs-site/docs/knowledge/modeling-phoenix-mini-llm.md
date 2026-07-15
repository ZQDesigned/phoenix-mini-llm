---
title: 5. 本项目模型设计
group:
  title: 模型
  order: 2
order: 5
toc: content
---

# 5. 本项目模型设计

## 目标不是“大参数”，而是“完整链路”

这个项目故意不追求 7B 或更大的规模。学习价值最高的是：

- 结构正确
- 训练能跑通
- loss 会下降
- 推理能生成文本
- checkpoint 可保存恢复

## 默认训练配置的定位

`configs/train.toml` 的默认目标是 6GB 显存量级下仍然可调整的起点：

- `hidden_size = 384`
- `num_layers = 6`
- `num_heads = 6`
- `intermediate_size = 1536`
- `max_seq_len = 256`
- tokenizer vocab 约 `8k`

## 为什么绑定输入输出 embedding

本项目把 `lm_head.weight` 绑定到 `token_embeddings.weight`。这么做的好处是：

- 减少参数量
- 与常见语言模型实践一致
- 对小模型更友好

## KV cache 在这里扮演什么角色

如果生成时每次都把整段上下文重新过一遍，推理成本会随着长度上涨。KV cache 会把历史 key/value 保留下来，让下一步只计算“新增 token”的部分。

这也是为什么你会在模型前向接口里看到：

```python
forward(input_ids, targets=None, use_cache=False, past_key_values=None)
```

这个接口同时服务于：

- 训练
- 普通前向
- 增量生成
