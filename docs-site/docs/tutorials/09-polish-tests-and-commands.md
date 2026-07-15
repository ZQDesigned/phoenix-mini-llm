---
title: 09. 补齐工程化细节、测试与命令
group:
  title: 复刻教程
  order: 0
order: 8
toc: content
---

import { Callout } from '../../src/components/Callout';

# 09. 补齐工程化细节、测试与命令

## 本章目标

把项目从“能跑起来”提升到“别人能维护、你未来也能回头继续用”的状态。完成后你应该有：

- 完整的测试集
- 清晰的 CLI 入口
- 三套配置文件
- README 中对关键命令的统一描述

## 你将新增或修改哪些文件

```text
tests/
configs/debug.toml
configs/dev.toml
configs/train.toml
README.md
src/phoenix_mini_llm/cli/common.py
scripts/*.py
```

## 为什么这一章很重要

很多项目在技术上已经完成 90%，最后却停在：

- 命令不统一
- 配置不知道怎么选
- 测试覆盖不够
- README 与实际入口不一致

结果就是作者自己几周后再回来，也要重新逆向工程。

## 你要做的几类补全

### 1. 配置层

至少区分：

- `debug.toml`: 最小可运行 smoke 路径
- `dev.toml`: 本地功能验证
- `train.toml`: Windows CUDA 正式训练起点

### 2. 测试层

确认这些目录已经有对应测试：

- `tests/data/`
- `tests/models/`
- `tests/training/`
- `tests/inference/`

### 3. 命令层

统一使用 CLI 入口，而不是混用：

- 有时跑 `uv run phoenix-train`
- 有时跑 `python src/...`
- 有时直接运行临时脚本

### 4. 文档层

README 至少要对齐：

- 依赖安装
- 数据准备
- 训练
- 评估
- 生成

## 常见错误

- `configs/` 文件存在，但参数命名彼此不一致。
- README 里写的命令和 `project.scripts` 不一致。
- 测试数量不少，但没有覆盖最关键的数据、cache 和 checkpoint 行为。

<Callout title="相关踩坑" tone="warning">
  如果 `.gitignore` 写法不小心，会把 `src/` 或 `tests/` 下的 `data` 包也误伤。相关案例见 [02. .gitignore 误伤 data 包](/pitfalls/02-gitignore-and-package-names)。
</Callout>

## 本章完成后如何检查

1. `uv run pytest` 全通过。
2. `uv run ruff check .` 与 `uv run pyright` 能正常执行。
3. README 里的所有主要命令都和实际 CLI 入口一致。

## 建议本地检查点名称

`tutorial-step-09`
