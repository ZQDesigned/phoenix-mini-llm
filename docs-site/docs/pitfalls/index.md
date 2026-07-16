---
title: 踩坑记录总览
nav:
  title: 踩坑记录
  order: 3
toc: content
---

# 踩坑记录总览

这一部分只记录真实出现过的问题，不负责重新讲一遍完整理论。它的价值在于告诉你：一个本来看似合理的实现，为什么会在工程现场出错。

## 这部分适合什么时候看

- 你已经开始做项目，但碰到了环境、路径、数据处理或设备差异问题。
- 你还没开始动手，想先知道哪些地方最容易浪费时间。
- 你已经看完教程，想理解当初为什么会做出某个工程约束。

## 时间线目录

1. [01. uv 在 PATH 中缺失](/pitfalls/01-uv-path-and-project-python)
2. [02. .gitignore 误伤 data 包](/pitfalls/02-gitignore-and-package-names)
3. [03. 流式数据集与子集规模](/pitfalls/03-streaming-datasets-and-prep-scale)
4. [04. Tokenizer 元数据同步](/pitfalls/04-tokenizer-metadata-sync)
5. [05. MPS 与 CUDA 的精度差异](/pitfalls/05-mps-vs-cuda-and-amp)
6. [06. 过度覆写 dumi 默认布局](/pitfalls/06-overriding-dumi-default-layout)
7. [07. GitHub Pages 子路径构建](/pitfalls/07-github-pages-subpath-and-base-config)

> **使用方式**
>
>   如果你正在做某个具体阶段，优先先完成当前阶段的“本章检查”，再来查踩坑记录。不要把这部分当成提前记忆的负担，而要把它当成定位问题和理解约束的参考库。
