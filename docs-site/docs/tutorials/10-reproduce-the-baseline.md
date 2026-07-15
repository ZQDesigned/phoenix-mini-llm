---
title: 10. 跑出仓库对齐的基线结果
group:
  title: 复刻教程
  order: 0
order: 9
toc: content
---

# 10. 跑出仓库对齐的基线结果

## 本章目标

把前九章拼起来，真正跑一次从数据准备到生成的完整链路，并确认你的项目已经与 `phoenix-mini-llm` 仓库对齐。完成后你应该能：

- 成功准备数据
- 用 debug 配置训练
- 评估 checkpoint
- 从 prompt 生成文本

## 你会执行哪些命令

```bash
uv sync --python 3.12
uv run phoenix-prepare-data --config configs/debug.toml
uv run phoenix-train --config configs/debug.toml
uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
uv run phoenix-generate --config configs/debug.toml --checkpoint latest --prompt "Once upon a time"
```

## 如何理解“基线成功”

这里的基线成功不是：

- 文本已经像大模型一样惊艳
- 训练损失已经非常低
- 你得到一个随时能上线的推理系统

而是：

- 数据准备链路通了
- tokenizer 工件正确
- 训练脚本能稳定跑步数、评估和存 checkpoint
- 生成脚本能读 checkpoint 并产出合理格式的文本

## 你要检查哪些结果

### 1. 数据侧

- `data/train.npy`
- `data/validation.npy`
- metadata JSON
- tokenizer 工件目录

### 2. 训练侧

- runs 或日志中能看到 step 递增
- checkpoints 目录有保存结果
- 训练损失不是完全静止或立即 NaN

### 3. 评估与生成侧

- 评估命令能读到 checkpoint
- 生成命令能正确编码 prompt、滚动生成并解码输出

## 如果结果不理想，先查哪里

1. 先看 `prepare_data` 是否真的生成了足够样本。
2. 再看 tokenizer special token id 是否和配置一致。
3. 再看训练损失是否下降，以及是否存在明显重复输出。
4. 最后回查设备和 AMP 设置。

<Callout title="最常见的误判" tone="warning">
  第一次跑出文本时，不要因为输出还不够漂亮就立刻判定“模型全错了”。先确认训练链路、checkpoint、采样和 tokenizer 是否一致，再判断是否需要更长训练或更好的配置。
</Callout>

## 仓库对齐检查清单

- 目录结构与 `src/phoenix_mini_llm/` 分层一致。
- CLI 名称与仓库 README 一致。
- `configs/debug.toml`、`configs/dev.toml`、`configs/train.toml` 都存在。
- 测试目录按 data / models / training / inference 划分。

## 复刻完成后下一步做什么

如果你已经成功完成这一步，接下来不要急着直接扩参数规模。更合理的下一步是：

1. 回去读不够稳的学习章节。
2. 复查踩坑记录，补上你当时绕过但没真正理解的问题。
3. 先改一个小配置，再重新训练，观察结果变化。

## 建议本地检查点名称

`tutorial-step-10`
