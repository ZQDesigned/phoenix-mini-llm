---
title: 完整复刻 phoenix-mini-llm
group:
  title: 实操
  order: 0
order: 1
toc: content
---

# 完整复刻 phoenix-mini-llm

这篇教程的目标是：让你从空目录开始，完整复刻 `phoenix-mini-llm` 的数据准备、训练、评估和生成流程。

## 第 0 步：先理解你要复刻什么

如果你还不熟悉下面这些概念，请先补知识档案：

- 工程环境：见 [1. Python、uv 与工程习惯](/knowledge/python-and-uv)
- tokenizer：见 [3. 文本数据与 Tokenizer](/knowledge/data-and-tokenization)
- 模型结构：见 [4. Transformer 基础](/knowledge/transformer-basics)
- 训练循环：见 [6. 训练与优化](/knowledge/training-and-optimization)

## 第 1 步：准备 Python 项目

进入项目目录后，确保 `uv` 可用，并同步环境：

```bash
~/.local/bin/uv sync --python 3.12
```

如果你的 `uv` 已在 PATH 中，也可以直接写成：

```bash
uv sync --python 3.12
```

## 第 2 步：准备数据

先跑最小调试配置：

```bash
uv run phoenix-prepare-data --config configs/debug.toml
```

成功后，应该看到这些产物：

```text
artifacts/prepare_metadata.json
artifacts/tokenizer/tokenizer.json
data/train.npy
data/validation.npy
```

## 第 3 步：开始调试训练

```bash
uv run phoenix-train --config configs/debug.toml
```

这一步的目标不是生成优美文本，而是确认：

- 训练能完成
- checkpoint 会写出
- 验证 loss 能被统计

成功后会看到：

```text
checkpoints/debug/step-000010.pt
checkpoints/debug/step-000020.pt
runs/debug/train_summary.json
```

## 第 4 步：评估 checkpoint

```bash
uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
```

你应该得到一份 JSON 输出，其中至少包含：

- checkpoint 路径
- 当前 step
- validation loss

## 第 5 步：生成文本

```bash
uv run phoenix-generate \
  --config configs/debug.toml \
  --checkpoint latest \
  --prompt "Once upon a time" \
  --max-new-tokens 32
```

在小步数、小模型情况下，输出不一定流畅，但脚本链路应当完整可用。

## 第 6 步：扩大到开发配置

当 `debug` 跑通后，再切到：

```bash
uv run phoenix-prepare-data --config configs/dev.toml
uv run phoenix-train --config configs/dev.toml
```

这里你会开始真正感受到：

- 数据规模变化
- tokenizer 规模变化
- 模型容量变化
- 训练时长变化

## 第 7 步：迁移到 Windows CUDA

正式训练前建议检查：

1. Windows 上安装的是 CUDA 版 PyTorch。
2. 项目重新执行过 `uv sync`。
3. 训练入口仍然使用同一套 `configs/train.toml`。
4. 先从较小步数开始冒烟，再拉长训练。

## 第 8 步：复刻完成的最低标准

满足下面四条，就算真正复刻成功：

1. `prepare_data` 能落地产物。
2. `train` 能写出 checkpoint。
3. `evaluate` 能返回验证损失。
4. `generate` 能从最新 checkpoint 产生文本。

## 第 9 步：你可以继续做什么

- 扩大 `train.toml` 的样本规模
- 调整 `hidden_size`、`num_layers`、`max_seq_len`
- 在 Windows 上打开更激进的 AMP 和梯度累积
- 加入更细粒度日志或实验记录

当你能自己完成这些变体时，你就已经不再是“照着抄教程”，而是在真正掌握一个小型 LLM 项目。
