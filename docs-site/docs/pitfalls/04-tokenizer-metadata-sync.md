---
title: 04. Tokenizer 元数据同步
toc: content
---

# 04. Tokenizer 元数据同步

## 发生背景

训练 tokenizer 之后，项目通常会同时生成：

- `tokenizer.json`
- 特殊 token id
- 词表大小
- 训练语料规模信息

如果这些信息没有被明确同步到 metadata 和模型配置里，后面的训练和生成会出现一种非常隐蔽的错误：代码都能跑，但语义已经错位。

## 现象

可能出现的现象包括：

- `bos/eos/pad/unk` 的 id 和你以为的不一致
- 模型配置里的 `vocab_size` 与真实 tokenizer 不一致
- 生成阶段 decode 出来的结果怪异，但又不至于直接崩溃

## 一开始的错误判断

这类问题最容易让人误判成：

- 训练不够久
- 模型结构有 bug
- 采样温度不合适

但很多时候，真正的问题是：模型和 tokenizer 根本没有在同一张“词表地图”上。

## 最终原因

tokenizer 训练完成后，如果你只保存了 `tokenizer.json`，却没有同步记录：

- `vocab_size`
- `pad_token_id`
- `bos_token_id`
- `eos_token_id`
- `unk_token_id`

那后面的配置就很容易凭想当然写死。

## 诊断过程

最有效的检查方式，是在数据准备完成后立刻比对：

```python
tokenizer.get_vocab_size()
metadata["special_token_ids"]
model_config.vocab_size
```

只要这三处的事实来源不一致，后面迟早出问题。

## 修复方式

1. 训练完 tokenizer 之后立即取出 special token id。
2. 把词表大小和 special token id 一并写入 metadata。
3. 构造 `ModelConfig` 时，优先从 tokenizer 结果而不是手写常量中拿这些值。

## 如何避免再次踩坑

- 永远不要假设 special token id “应该就是 0,1,2,3”，除非你已经在工件里确认过。
- tokenizer 工件一旦生成，就把它当成模型配置的一部分事实来源。
- 如果输出异常，先查 metadata，再怀疑模型。

<Callout title="这是最隐蔽的一类问题之一" tone="warning">
  因为它常常不会让程序立即报错，只会让训练目标和生成行为 quietly drift。对初学者来说，这比直接报错更危险。
</Callout>
