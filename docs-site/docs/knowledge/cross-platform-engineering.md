---
title: 8. 跨平台工程实践
group:
  title: 工程
  order: 5
order: 8
toc: content
---

# 8. 跨平台工程实践

## 目标平台不是单一的

这个项目默认假设：

- macOS：开发、测试、小规模验证
- Windows + NVIDIA GPU：正式训练

## 设备抽象的原则

业务代码里不要到处写 `.cuda()`。统一通过设备检测函数决定是：

- `cuda`
- `mps`
- `cpu`

然后所有 Tensor 和模型都用 `.to(device)`。

## 路径为什么必须用 `Path`

因为你不想在代码里出现：

```python
"/Users/..."
"D:\\models\\..."
```

`pathlib.Path` 是跨平台最省心的做法。

## Windows 训练时要额外警惕什么

- DataLoader 多进程行为
- CUDA 版 PyTorch 安装
- AMP 和显存预算
- checkpoint 存储路径

建议先用 `num_workers = 0` 跑通，再逐步提高。
