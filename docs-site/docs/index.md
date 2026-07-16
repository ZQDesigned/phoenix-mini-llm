---
title: Phoenix Mini LLM
description: Phoenix Mini LLM 文档站首页，提供学习主线、复刻教程与踩坑记录的统一入口。
template: home.html
hide:
  - navigation
  - toc
---

<div class="phoenix-home-page" markdown>

## 开始阅读

首页只做一件事：把你送到正确的入口。如果你是从 0 开始学，就按学习主线顺序往下读；如果你已经有 Python 基础但没做过 LLM，就先看总序，再进入复刻教程；如果你正在复做并遇到偏差，回踩坑记录查根因。

<div class="grid cards" markdown>

-   **学习主线**

    ---

    从数学对象、概率、神经网络到序列建模、Attention、Transformer、训练与推理，按知识前置关系展开。

    [顺序阅读 13 卷内容](learning/index.md)

-   **复刻教程**

    ---

    从项目骨架、语料、Tokenizer、模型、训练器、Checkpoint 到采样与评估，自己做出与仓库一致的实现。

    [跟着 10 章教程复做](tutorials/index.md)

-   **踩坑记录**

    ---

    记录环境、路径、设备精度、数据处理与 GitHub Pages 发布中的真实问题，方便在偏差出现时快速定位。

    [按时间顺序查问题](pitfalls/index.md)

</div>

## 推荐路径

<div class="grid cards" markdown>

-   **Step 1 · 先搭认知地图**

    ---

    先读学习总序以及前十卷，把“token 为什么存在”“目标为什么右移一位”“Attention 为什么出现”这条因果链搭完整。

-   **Step 2 · 再按章节自己复做**

    ---

    跟着教程从空目录起步，不跳步骤，不直接抄最终代码，而是把 tokenizer、模型、训练器和采样逻辑逐步拼出来。

-   **Step 3 · 遇到偏差再回日志校正**

    ---

    当环境、路径、MPS/CUDA 精度或发布链路出现差异时，再回踩坑记录按真实案例检查约束和修复方式。

</div>

## 项目边界

<div class="grid cards" markdown>

-   **这套项目关注什么**

    ---

    - 一个适合学习的小型 decoder-only 语言模型
    - 从语料、Tokenizer、模型、训练到生成的完整链路
    - 在有限显存约束下仍可解释、可训练、可复刻的实现

-   **这套项目不追求什么**

    ---

    - 不把重点放在超大参数规模或营销式“大模型感”包装
    - 不把文档写成只会复制命令的部署说明
    - 不把工程脚手架包装成无法解释的黑箱

</div>

## 学完后你应该具备的能力

<div class="grid cards" markdown>

-   **解释机制**

    ---

    能解释 token、embedding、cross-entropy、attention、KV cache 在同一台模型中的角色与关系。

-   **独立落地**

    ---

    能从空目录配置 `uv`、组织 Python 包、准备语料和 tokenizer，并把训练与推理链路接完整。

-   **跨平台推进**

    ---

    能在 macOS 上验证实现，在 Windows + CUDA 上做正式训练，并提前处理设备与路径差异。

-   **系统排错**

    ---

    当 loss 不降、采样异常、路径错乱或 Pages 发布偏差时，知道该优先检查哪一层。

</div>

## 快速开始

零基础读者建议从学习主线总序开始；已经有 Python 基础但没做过 LLM 的读者，可以先读总序，再直接进入教程第 1 章。

[阅读学习总序](learning/index.md){ .md-button .md-button--primary }
[打开教程第 1 章](tutorials/01-bootstrap-the-project.md){ .md-button }
[查看 GitHub 仓库](https://github.com/ZQDesigned/phoenix-mini-llm){ .md-button }

```bash
cd docs-site
uv sync --python 3.12
uv run mkdocs serve
```

</div>
