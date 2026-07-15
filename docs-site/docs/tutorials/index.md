---
title: 复刻总览
nav:
  title: 复刻教程
  order: 2
toc: content
---

import { Callout } from '../../src/components/Callout';
import { StageChecklist } from '../../src/components/StageChecklist';

# 复刻总览

这一部分的目标不是教你“如何运行仓库里已有的脚本”，而是带你从空目录开始，把一个和当前 `phoenix-mini-llm` 同等结构、同等职责划分的小型语言模型项目一步一步搭出来。

## 复刻前你至少应该知道什么

- 会创建 Python 项目并安装依赖。
- 知道什么是张量、损失函数和训练循环。
- 理解 Tokenizer、Attention 和 Transformer Block 的基本职责。

如果你还不满足这些前置，请先回到 [学习主线](/learning)。

<Callout title="如何使用这套教程" tone="warning">
  这是一套按阶段推进的工坊式教程。请按顺序完成，不要直接跳到某一章复制最终代码。每一章都假设上一章已经真实完成并且验证通过。
</Callout>

## 10 个阶段

<StageChecklist
  items={[
    <a href="/tutorials/01-bootstrap-the-project">01. 建立项目骨架</a>,
    <a href="/tutorials/02-prepare-the-corpus">02. 准备语料与数据管线</a>,
    <a href="/tutorials/03-train-the-tokenizer">03. 训练 Tokenizer</a>,
    <a href="/tutorials/04-build-a-tiny-training-loop">04. 写最小训练闭环</a>,
    <a href="/tutorials/05-implement-attention-and-blocks">
      05. 实现 Attention 与 Transformer Block
    </a>,
    <a href="/tutorials/06-assemble-the-model">06. 拼出 phoenix-mini-llm 主模型</a>,
    <a href="/tutorials/07-build-training-and-checkpointing">
      07. 写正式训练器与 Checkpoint 链路
    </a>,
    <a href="/tutorials/08-build-generation-and-sampling">08. 写生成与采样逻辑</a>,
    <a href="/tutorials/09-polish-tests-and-commands">
      09. 补齐工程化细节、测试与命令
    </a>,
    <a href="/tutorials/10-reproduce-the-baseline">10. 跑出仓库对齐的基线结果</a>,
  ]}
/>

## 每一章都会给你什么

- 本章目标
- 你要新增或修改的文件
- 推荐的实现顺序
- 为什么代码要这样组织
- 最容易踩的坑
- 本章结束前必须做的检查
- Git 对照检查点

## Git 阶段检查点怎么用

建议你在本地把每一章完成后的 commit 或 tag 命名为 `tutorial-step-01` 到 `tutorial-step-10`。这样做的目的不是制造形式感，而是为了让你能清楚回看“这一阶段到底完成了什么”。正确用法是：

1. 先按教程自己写。
2. 本章验证通过后，给当前状态做一次本地 commit 或 tag。
3. 如果后面出问题，就能回退到上一个稳定阶段。
4. 如果差异很大，再回看本章解释或相关踩坑页。
