---
title: 5. MPS 与 CUDA 的精度差异
group:
  title: 训练阶段
  order: 2
order: 5
toc: content
---

# 5. MPS 与 CUDA 的精度差异

## 现象

macOS MPS 可以帮助本地开发，但它不等于 Windows CUDA。两边在：

- AMP 行为
- 数值稳定性
- 算子成熟度

上都可能有差别。

## 工程策略

- `debug` 和 `dev` 配置优先保证“跑通”
- AMP 默认只在 CUDA 训练配置里打开
- 训练脚本根据设备类型决定是否启用自动混合精度

## 经验

如果某个模型在 MPS 上能跑，不代表在 CUDA 上一定无痛；反过来也一样。跨平台学习项目的关键，是把设备分歧显式写进代码结构里。
