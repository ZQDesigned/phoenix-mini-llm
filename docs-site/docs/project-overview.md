---
title: 项目总览
description: Phoenix Mini LLM 文档站的总体阅读说明、项目边界与学习预期。
---

# 阅读入口

<div className="phoenix-track-grid">
  <section className="phoenix-track-card">
    <h3>学习主线</h3>
    <p>适合第一次做语言模型项目的读者。你会从问题定义、张量和损失函数一路走到训练工程和推理采样。</p>
    <a href="#/learning">按章节开始学习</a>
  </section>
  <section className="phoenix-track-card">
    <h3>复刻教程</h3>
    <p>适合想从空目录一步一步做出同款项目的人。它不是运行说明，而是分阶段的构建工坊。</p>
    <a href="#/tutorials">进入 10 阶段复刻</a>
  </section>
  <section className="phoenix-track-card">
    <h3>踩坑记录</h3>
    <p>适合已经开始动手，但在环境、路径、数据处理、设备差异等问题上卡住的读者。</p>
    <a href="#/pitfalls">按时间线回顾问题</a>
  </section>
</div>

## 这份站点适合谁

- 想系统理解“小型 LLM 项目到底由哪些部分组成”的初学者。
- 想在 macOS 上开发、在 Windows + NVIDIA GPU 上正式训练的人。
- 想自己写出训练、评估、生成链路，而不是只调用高级封装库的人。

## 推荐阅读顺序

1. 如果你几乎从零开始，先读 [学习主线](#/learning)。
2. 如果你已经懂 Python 但没做过语言模型项目，至少先补完 `01` 到 `08` 章再开始复刻。
3. 开始实作后，按 [复刻教程](#/tutorials) 的 `10` 个阶段走，不要跳步。
4. 在任何一步出现非预期问题时，再回到 [踩坑记录](#/pitfalls) 查找对应案例。

> **项目边界**
>
>   这套项目聚焦一个适合学习的小型 decoder-only 语言模型。目标是把从语料、Tokenizer、模型、训练到生成的链路做完整，而不是把参数规模堆到超出 6GB 显存约束的级别。

## 读完整个站点后你应该能做到什么

- 解释 token、embedding、cross-entropy、attention、checkpoint 和 KV cache 在项目里的作用。
- 从空目录开始配置 `uv`、组织源码包、准备数据、训练 tokenizer、实现训练脚本和生成脚本。
- 理解为什么 `phoenix-mini-llm` 采用当前的项目结构，以及这些设计如何兼顾学习性和工程可维护性。

## 代码与文档的关系

```text
mini-llm/
├── src/phoenix_mini_llm/   # 模型、数据、训练、推理代码
├── tests/                  # 项目测试
├── docs-site/              # dumi 文档站
└── README.md               # 仓库总览
```

文档不会把代码抽象成一个“另一个世界里的示例项目”。它描述的就是这个仓库本身。
