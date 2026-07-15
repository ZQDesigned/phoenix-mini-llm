---
title: 9. 评估、排错与下一步
group:
  title: 工程
  order: 5
order: 9
toc: content
---

# 9. 评估、排错与下一步

## 先看什么指标

对这个学习项目，最优先的不是“文本像不像 GPT”，而是：

- 训练是否稳定完成
- 验证 loss 是否下降
- checkpoint 是否可恢复
- generate 脚本是否能输出合理字符流

## 最常见的排错路径

1. 先确认 `prepare_data` 产物存在
2. 再确认 tokenizer 元数据和模型词表一致
3. 再看训练 loss 是否为 `nan`
4. 再看生成脚本是否加载了最新 checkpoint

## 读完这套文档后可以继续做什么

- 扩大 TinyStories 子集
- 提升 `max_seq_len`
- 切换到更大的 tokenizer 词表
- 加入更细的日志和可视化
- 在 Windows CUDA 上打开 AMP 和更大的梯度累积

如果这些变化你都能自己实现，说明你已经不只是“复刻项目”，而是真正掌握了一个小型 LLM 工程。
