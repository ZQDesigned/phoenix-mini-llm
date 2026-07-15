---
title: 1. Python、uv 与工程习惯
group:
  title: 基础
  order: 0
order: 1
toc: content
---

# 1. Python、uv 与工程习惯

## 为什么这个项目不用 Notebook 当主战场

Notebook 很适合实验，但不适合作为完整工程的唯一载体。一个小型 LLM 项目至少会包含：

- 数据下载和清洗
- tokenizer 训练
- 模型定义
- 训练循环
- checkpoint
- 评估与生成
- 单元测试

这类内容如果全部塞进 Notebook，后续维护成本会迅速上升。`phoenix-mini-llm` 采用源码包结构，把实验性内容降到最少。

## uv 的角色

`uv` 是这个项目的 Python 包管理入口，它负责：

- 安装指定 Python 版本
- 管理项目虚拟环境
- 解析依赖并生成 `uv.lock`
- 用 `uv run ...` 执行脚本，保证命令落在正确环境

最重要的习惯是：**不要混用 IDE 内建安装器、系统 pip 和项目级 uv**。

## 你要理解的最小工程约定

### 1. `pyproject.toml`

这是项目的依赖和工具配置中心，记录：

- 项目名
- Python 版本约束
- 运行时依赖
- 开发依赖
- 脚本入口
- pytest / ruff / pyright 配置

### 2. `src/` 包布局

源码都放在 `src/phoenix_mini_llm/`，避免“当前目录碰巧能 import”这种脆弱行为。

### 3. `configs/*.toml`

把运行模式拆成 `debug`、`dev`、`train` 三类配置，是跨平台学习项目的关键做法。你应该把：

- 调试规模
- 开发规模
- 正式训练规模

分开描述，而不是靠手工改脚本常量。

## 学会看命令入口

这个项目的主流程命令是：

```bash
uv run phoenix-prepare-data --config configs/debug.toml
uv run phoenix-train --config configs/debug.toml
uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
uv run phoenix-generate --config configs/debug.toml --checkpoint latest --prompt "Once upon a time"
```

看懂这些命令的参数，基本等于看懂了整个项目的生命周期。
