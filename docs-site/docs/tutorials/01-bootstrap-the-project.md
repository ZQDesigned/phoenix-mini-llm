---
title: 01. 建立项目骨架
group:
  title: 复刻教程
  order: 0
order: 0
toc: content
---

# 01. 建立项目骨架

## 本章目标

从空目录开始，搭出一个和 `phoenix-mini-llm` 一样的基础工程壳子。完成这一章之后，你应该拥有：

- 一个由 `uv` 管理的 Python 项目
- `src/` 源码包结构
- 开发依赖和命令行入口
- `configs/`、`scripts/`、`tests/` 等基础目录

## 你将新增或修改哪些文件

```text
pyproject.toml
README.md
src/phoenix_mini_llm/__init__.py
src/phoenix_mini_llm/cli/__init__.py
tests/
configs/debug.toml
configs/dev.toml
configs/train.toml
```

## 先做什么，再做什么

1. 新建项目目录并初始化 `uv`。
2. 把项目名固定为 `phoenix-mini-llm`。
3. 创建 `src/phoenix_mini_llm/` 包。
4. 补上运行时依赖和开发依赖。
5. 定义命令行入口和基础配置文件目录。

## 关键命令

```bash
mkdir phoenix-mini-llm
cd phoenix-mini-llm

uv init --package
uv add torch datasets tokenizers numpy tqdm safetensors
uv add --dev pytest pytest-cov ruff pyright
```

然后把目录补齐：

```bash
mkdir -p src/phoenix_mini_llm/cli
mkdir -p configs scripts tests
touch src/phoenix_mini_llm/__init__.py
touch src/phoenix_mini_llm/cli/__init__.py
```

## 为什么这样设计

### 1. 为什么一开始就用源码包结构

因为你最终会有：

- 数据准备逻辑
- 模型模块
- 训练模块
- 推理模块
- CLI 入口

如果不从第一天开始用包结构，后期文件关系会迅速混乱。

### 2. 为什么先建 `configs/`

这个项目不是一次性脚本。你需要至少区分：

- 最小可运行 smoke 配置
- 本地开发验证配置
- Windows CUDA 训练配置

配置文件目录应该从一开始就是项目的一部分。

### 3. 为什么优先暴露 CLI 入口

你最终希望执行的是：

```bash
uv run phoenix-prepare-data
uv run phoenix-train
uv run phoenix-evaluate
uv run phoenix-generate
```

而不是记一长串“去哪个脚本文件里运行什么命令”。

## 本章你至少要写出来的 `pyproject.toml` 结构

```toml
[project]
name = "phoenix-mini-llm"
requires-python = ">=3.11,<3.13"

[project.scripts]
phoenix-prepare-data = "phoenix_mini_llm.cli.prepare_data:main"
phoenix-train = "phoenix_mini_llm.cli.train:main"
phoenix-evaluate = "phoenix_mini_llm.cli.evaluate:main"
phoenix-generate = "phoenix_mini_llm.cli.generate:main"
```

你现在还不用把这些入口真正实现完，但名字先固定下来，后面教程都会基于这些入口推进。

## 常见错误

- 直接把代码平铺在仓库根目录。
- 先用系统 Python 装依赖，后面再补虚拟环境。
- 等到项目变大才想起来补 `configs/` 和 `tests/`。

<Callout title="相关学习章节" tone="note">
  如果你对 `uv`、`src/` 包结构或者命令行入口还不熟，先回去补 [02. Python 环境与 uv](/learning/02-python-environment-and-uv)。
</Callout>

## 本章完成后如何检查

1. `uv sync` 能成功。
2. `uv run python -c "import phoenix_mini_llm"` 不报错。
3. `pyproject.toml` 已经定义四个目标 CLI 名称。
4. `configs/`、`src/`、`tests/` 目录都存在。

## 建议本地检查点名称

`tutorial-step-01`
