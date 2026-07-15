---
title: 踩坑记录总览
nav:
  title: 踩坑记录
  order: 2
toc: content
---

# 踩坑记录总览

这一部分不讲抽象理论，只记录开发过程中真实出现的问题。阅读顺序就是开发顺序。

## 目录

1. [uv 在 PATH 中缺失](/pitfalls/01-uv-path-and-project-python)
2. [.gitignore 误伤 data 包](/pitfalls/02-gitignore-and-package-names)
3. [流式数据集与子集规模](/pitfalls/03-streaming-datasets-and-prep-scale)
4. [Tokenizer 元数据同步](/pitfalls/04-tokenizer-metadata-sync)
5. [MPS 与 CUDA 的精度差异](/pitfalls/05-mps-vs-cuda-and-amp)

## 怎么使用这部分文档

- 如果你在复刻过程中卡住，优先按现象找对应问题。
- 如果你还没开始动手，先通读一遍，可以明显减少无效排错时间。
