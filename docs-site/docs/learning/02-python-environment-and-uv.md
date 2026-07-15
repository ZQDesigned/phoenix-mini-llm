---
title: 02. Python 环境与 uv
group:
  title: 学习主线
  order: 0
order: 1
toc: content
---

# 02. Python 环境与 uv

## 这一章要解决什么问题

很多初学者不是卡在模型原理，而是卡在“项目为什么在我的机器上跑不起来”。原因通常不是 PyTorch 太难，而是工程环境一开始就没有收紧：Python 版本漂移、依赖装在全局环境里、命令和配置散在各处。

这一章的目标，是把 `phoenix-mini-llm` 所需的本地工程约束讲清楚，让你知道为什么这个项目选择 `uv`，以及一个可复现的源码包结构到底长什么样。

## 你需要先知道什么

- 会执行基本终端命令。
- 知道文件和目录的基本含义。

## 核心概念

### 1. 为什么要用虚拟环境

虚拟环境的作用只有一个：把“这个项目需要的依赖”跟“别的项目需要的依赖”隔离开。

如果不隔离，你会遇到这些问题：

- A 项目需要 `torch` 某个版本，B 项目又需要另一个版本
- 你今天能跑，几周后升级了全局包又跑不动
- Windows 和 macOS 上的 Python 解释器路径不一致

虚拟环境不是高级技巧，它是项目可复现的最低门槛。

### 2. 为什么是 `uv`

`uv` 的优势不是“更时髦”，而是它把几件通常分散的事收在一起：

- 管理 Python 版本
- 创建虚拟环境
- 安装依赖
- 锁定依赖版本
- 用当前项目环境执行命令

在这个项目里，你会频繁用到：

- `uv sync`
- `uv add`
- `uv run ...`

### 3. `pyproject.toml` 是项目的中心清单

`pyproject.toml` 不是单纯的“依赖列表”，它还描述：

- 项目名称
- Python 版本约束
- 命令行入口
- 测试、lint、类型检查配置

当你看见：

```toml
[project.scripts]
phoenix-train = "phoenix_mini_llm.cli.train:main"
```

它的意思是：执行 `uv run phoenix-train` 时，最终会调用 `src/phoenix_mini_llm/cli/train.py` 里的 `main()`。

### 4. 为什么要采用 `src/` 源码包结构

这个仓库的核心代码放在：

```text
src/phoenix_mini_llm/
```

这样做有两个好处：

1. 你必须通过“包导入”的方式使用代码，而不是依赖当前目录的偶然行为。
2. 测试和命令行入口更接近真实安装后的使用方式。

如果所有 `.py` 文件都平铺在仓库根目录，项目在变大后会很快失控。

## 最小必要数学

这一章几乎不需要数学，但要理解一个工程关系：

```text
source code + dependency versions + command entry points = reproducible project
```

任何一项不稳定，结果都可能“不知道为什么这次和上次不一样”。

## 最小代码实验

先看一下 `uv run` 到底帮你做了什么：

```bash
uv run python -c "import sys; print(sys.executable)"
```

输出的解释器路径应该指向项目自己的环境，而不是系统全局 Python。

再看一个命令行入口的最小例子：

```python
def main() -> None:
    print("hello from phoenix-mini-llm")
```

如果在 `pyproject.toml` 里注册：

```toml
[project.scripts]
phoenix-hello = "phoenix_mini_llm.cli.hello:main"
```

那你就可以直接执行：

```bash
uv run phoenix-hello
```

这就是为什么项目里会专门有一个 `cli/` 子包。

## 常见误区

### 误区 1：直接在系统 Python 上安装依赖也没问题

短期可能看起来没问题，长期几乎必出问题。只要你切换机器、切换项目、升级包或者清理环境，就会发现无法追踪的差异。

### 误区 2：`requirements.txt` 和 `pyproject.toml` 随便选一个就行

对小脚本也许可行，但对一个要维护源码包、脚本入口和开发工具配置的项目来说，`pyproject.toml` 更适合作为单一事实来源。

### 误区 3：脚本文件放根目录更直接

项目初期你会觉得“快”，但随着数据处理、训练、推理、测试全部出现，根目录会立刻变成混乱堆场。目录结构不是形式主义，它是在替未来的你减少认知负担。

<Callout title="跨平台约束" tone="warning">
  你会在 macOS 上开发、在 Windows CUDA 上正式训练。工程环境必须从第一天开始避免硬编码路径、避免写死 `cuda()` 调用，也不要把虚拟环境目录带进 Git。
</Callout>

## 练习题

1. 为什么 `uv run` 比“先手动激活虚拟环境，再运行命令”更稳定？
2. `src/phoenix_mini_llm/` 这种目录结构，解决了什么工程问题？
3. 如果一个命令在你的终端里调用的是系统 Python，而不是项目环境，会造成什么后果？

## 下一章会用到什么

环境准备好之后，下一章会回到模型最底层的数据结构：tensor。只要看懂 shape、batch 和矩阵乘法，你后面再看 embedding 和 attention 就不会完全抽象。
