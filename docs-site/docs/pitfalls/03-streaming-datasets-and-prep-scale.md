---
title: 3. 流式数据集与子集规模
group:
  title: 数据准备
  order: 1
order: 3
toc: content
---

# 3. 流式数据集与子集规模

## 现象

如果直接把完整数据集全部下载并立即处理，准备时间和本地存储压力都会明显上升。

## 处理方法

项目使用 Hugging Face `datasets` 的流式读取，然后只截取配置中指定数量的样本：

- `max_train_examples`
- `max_validation_examples`

## 为什么这样做

学习项目更重要的是：

- 快速跑通链路
- 快速验证 loss
- 快速看到生成输出

等流程稳定后，再扩大数据规模。
