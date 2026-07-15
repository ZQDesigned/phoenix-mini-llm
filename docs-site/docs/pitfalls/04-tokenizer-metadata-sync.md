---
title: 4. Tokenizer 元数据同步
group:
  title: 数据准备
  order: 1
order: 4
toc: content
---

# 4. Tokenizer 元数据同步

## 现象

如果训练脚本只读静态 TOML，而不读取数据准备阶段写出的 tokenizer 元数据，就可能出现：

- 模型词表大小与实际 tokenizer 不一致
- 特殊 token id 不一致

## 修复

在 `prepare_data` 结束时写出 `prepare_metadata.json`，训练、评估和生成脚本启动时都先读它，再覆盖模型配置中的：

- `vocab_size`
- `pad_token_id`
- `bos_token_id`
- `eos_token_id`
- `unk_token_id`

## 经验

凡是“先准备数据，再训练模型”的项目，都应该把关键准备产物元数据化，而不是靠人工记忆。
