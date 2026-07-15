---
title: 复刻总览
nav:
  title: 复刻教程
  order: 2
toc: content
---

# 复刻总览

这部分不是“仓库使用说明”，而是一套从空目录开始、按阶段复做 `phoenix-mini-llm` 的完整工坊。你最终做出的，不是一个抽象练习项目，而是一个和当前仓库在目录职责、配置方式、训练链路、推理接口上都一致的小型 decoder-only 语言模型工程。

## 这套教程解决什么问题

很多教程会在两个极端里摇摆：

- 要么只有“从理论到代码”的思路讲解，但不告诉你该如何把文件真正落到工程里。
- 要么直接让你 `git clone` 一个现成仓库，然后把“运行成功”误当成“学会了实现”。

这里的目标是第三种路径：

1. 你先通过 [学习主线](/learning) 搭起必要概念。
2. 然后跟着 10 个阶段，从项目骨架、数据、Tokenizer、模型、训练、采样一路写到基线复现。
3. 每一章都明确告诉你要改哪些文件、先做什么、如何验证、哪些结果算“和仓库一致”。

## 开始之前，你应该准备好什么

- 能在终端里使用 `uv`、`git`、`pytest`。
- 已经通读过 [学习主线总览](/learning)。
- 至少读完这些前置章节：
  - [01. 你到底在做什么](/learning/01-what-you-are-building)
  - [02. Python 环境与 uv](/learning/02-python-environment-and-uv)
  - [05. 从文本到 Token](/learning/05-text-to-tokens)
  - [08. Transformer Block](/learning/08-transformer-blocks)
  - [10. 训练工程](/learning/10-training-engineering)

<Callout title="正确的阅读方式" tone="warning">
  这不是一套适合“跳读复制”的教程。请按顺序推进，并在每一章结束时真的运行命令、看输出、做测试。只有这样，你得到的才是可调试、可解释的工程能力。
</Callout>

## 10 个阶段与最终产物的对应关系

| 阶段 | 你会完成什么 | 关键文件 | 本章结束后必须能做到什么 |
| --- | --- | --- | --- |
| [01. 建立项目骨架](/tutorials/01-bootstrap-the-project) | 初始化 `uv` 项目、源码包结构、配置体系与命令入口 | `pyproject.toml`, `configs/*.toml`, `src/phoenix_mini_llm/config.py` | 能加载配置，能通过 `uv run python -c "import phoenix_mini_llm"` |
| [02. 准备语料与数据管线](/tutorials/02-prepare-the-corpus) | 下载 TinyStories 子集、标准化文本、打包成训练序列 | `src/phoenix_mini_llm/data/*.py` | 能把文本整理成 `train.npy` / `validation.npy` 需要的中间结构 |
| [03. 训练 Tokenizer](/tutorials/03-train-the-tokenizer) | 训练 BPE Tokenizer，写出元数据与准备 CLI | `src/phoenix_mini_llm/data/tokenizer.py`, `src/phoenix_mini_llm/cli/prepare_data.py` | 能生成 `tokenizer.json`、`prepare_metadata.json`、打包后的 `.npy` |
| [04. 写最小训练闭环](/tutorials/04-build-a-tiny-training-loop) | 写出最小训练步、评估步与恢复基础 | `src/phoenix_mini_llm/training/loop.py` | 能在一个极小模型上完成一次前向、反向、优化更新 |
| [05. 实现 Attention 与 Transformer Block](/tutorials/05-implement-attention-and-blocks) | 写 RoPE、RMSNorm、SwiGLU、Causal Self-Attention | `src/phoenix_mini_llm/models/rope.py`, `src/phoenix_mini_llm/models/layers.py` | 能得到因果掩码正确、支持 KV Cache 的单层 Block |
| [06. 拼出主模型](/tutorials/06-assemble-the-model) | 组装完整 `PhoenixMiniLM` 并共享词嵌入 / 输出头权重 | `src/phoenix_mini_llm/models/transformer.py` | 模型前向能输出 `logits`、`loss` 和 `past_key_values` |
| [07. 写正式训练器与 Checkpoint 链路](/tutorials/07-build-training-and-checkpointing) | 写优化器、调度器、Checkpoint 与训练 CLI | `src/phoenix_mini_llm/training/*.py`, `src/phoenix_mini_llm/cli/train.py` | 能保存 `step-000250.pt` 这类检查点并支持恢复 |
| [08. 写生成与采样逻辑](/tutorials/08-build-generation-and-sampling) | 写 top-k / top-p 采样和自回归生成 | `src/phoenix_mini_llm/inference/*.py`, `src/phoenix_mini_llm/cli/generate.py` | 能从 checkpoint 出发生成文本 |
| [09. 补齐工程化细节、测试与命令](/tutorials/09-polish-tests-and-commands) | 整理脚本包装、设备检测、随机种子与测试矩阵 | `scripts/*.py`, `tests/**`, `src/phoenix_mini_llm/utils/*.py` | `uv run pytest` 全绿，CLI 行为稳定 |
| [10. 跑出仓库对齐的基线结果](/tutorials/10-reproduce-the-baseline) | 用 `debug` / `dev` / `train` 配置跑出真实工件与检查点 | `configs/*.toml`, 运行命令与产物目录 | 你能独立复现实验，而不依赖现成输出 |

## 每一章都会交付什么

- 明确的目标和阶段边界。
- 本章对应的仓库文件清单。
- 推荐的实现顺序。
- 核心代码骨架或关键实现片段。
- 本章结束时必须执行的验证命令。
- 最容易出现的偏差与对照方式。

## 这套教程和知识档案怎么配合

当你在教程里看到下面这些问题时，不要硬背结论，而是回到对应的知识档案：

- 为什么 `pack_token_sequences()` 要按 `sequence_length + 1` 切块：
  回到 [06. 语言模型训练目标](/learning/06-language-modeling-objective)。
- 为什么 Attention 需要因果掩码和 KV Cache：
  回到 [07. 从 MLP 到 Attention](/learning/07-from-mlp-to-attention) 和 [08. Transformer Block](/learning/08-transformer-blocks)。
- 为什么 `train/dev/debug` 三套配置要从第一天就固定：
  回到 [10. 训练工程](/learning/10-training-engineering)。
- 为什么 Mac 开发和 Windows CUDA 训练不能完全等价：
  回到 [02. Python 环境与 uv](/learning/02-python-environment-and-uv) 与 [05. MPS 与 CUDA 的精度差异](/pitfalls/05-mps-vs-cuda-and-amp)。

## 推荐的工作节奏

1. 先读一章的“本章目标”和“实现顺序”。
2. 在自己仓库里真正创建或修改对应文件。
3. 运行本章给出的验证命令。
4. 如果结果不一致，先查本章“常见偏差”，再回看相关知识档案和踩坑页。
5. 本章通过后，打一个阶段检查点。

## 阶段检查点怎么打

建议每一章结束后，都创建一个本地提交或 tag，例如：

```bash
git add .
git commit -m "tutorial-step-01"
```

或者：

```bash
git tag tutorial-step-01
```

这样做的意义不是形式化，而是为了让你始终知道：

- 当前代码是否已经稳定。
- 某个 bug 是在哪一阶段引入的。
- 你和仓库最终实现的差异，是出现在“数据阶段”还是“模型阶段”。

## 现在从哪里开始

如果你的目录还是空的，直接进入 [01. 建立项目骨架](/tutorials/01-bootstrap-the-project)。

如果你已经有一个 Python 项目，但目录结构、配置命名、CLI 入口都和这里不同，也建议从第 1 章重新梳理。这个项目的难点不只是模型本身，更是让每一层职责保持清晰。
