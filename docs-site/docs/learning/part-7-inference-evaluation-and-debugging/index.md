---
title: Part 7. 推理、评估与调试
group:
  title: 学习主线
  order: 0
toc: content
---

# Part 7. 推理、评估与调试

训练结束之后，真正困难的问题往往才刚开始出现：

- loss 看起来正常，但生成质量很差
- 样例输出有点像语言，却明显不稳定
- 模型能继续训练，但你不确定哪里正在悄悄出错

这一卷的职责，就是把“如何使用模型”和“如何判断模型状态”放回同一条主线上。

## 这一卷接下来的章节规划

这一卷现在按下面的主线展开：

- [01. 自回归生成、prefill 与 decode](/learning/part-7-inference-evaluation-and-debugging/01-autoregressive-generation-prefill-and-decode)
- [02. 从 logits 到下一个 token](/learning/part-7-inference-evaluation-and-debugging/02-from-logits-to-the-next-token)
- [03. greedy、temperature、top-k 与 top-p 各在控制什么](/learning/part-7-inference-evaluation-and-debugging/03-what-greedy-temperature-top-k-and-top-p-actually-control)
- [04. EOS、停止条件与重复问题](/learning/part-7-inference-evaluation-and-debugging/04-eos-stopping-criteria-and-repetition)
- [05. KV cache 到底缓存了什么](/learning/part-7-inference-evaluation-and-debugging/05-what-kv-cache-is-actually-saving)
- [06. 为什么训练 loss 与生成质量不总同步](/learning/part-7-inference-evaluation-and-debugging/06-why-training-loss-and-generation-quality-do-not-always-move-together)
- [07. 困惑度、验证集与定性样例怎样一起评估](/learning/part-7-inference-evaluation-and-debugging/07-how-to-use-perplexity-validation-and-qualitative-samples-together)
- [08. 极小样本过拟合与系统化排错](/learning/part-7-inference-evaluation-and-debugging/08-overfit-a-tiny-batch-and-debug-the-whole-pipeline)

对学习项目来说，这一卷非常关键，因为一个人是否真的掌握了模型，通常不取决于“是否跑通过一次”，而取决于：

> 当结果不对时，他是否知道怎样缩小范围并修复。

## 这一卷的内部逻辑

这一卷不是把“推理”“评估”“调试”三个词平铺，而是在讲一条连续链：

1. 模型怎样把一个 prompt 滚动扩展成输出  
2. 词表分布怎样变成具体 token 决策  
3. 采样与停止条件怎样改变外显行为  
4. 评估怎样把数值趋势和文本样例结合起来  
5. 当行为不对时，怎样从整条链路往回缩小问题  

如果这条链断了，读者就很容易出现两种极端：

- 只会看 loss，不会看生成行为
- 只会调采样，不会判断训练链路是否本来就坏了

## 读完之后你应该获得的能力

读完这一卷后，你至少应该能稳定回答：

- 为什么推理阶段和训练阶段不是同一种信息可见条件
- 为什么同一个模型只改采样参数，输出风格就会明显变化
- 为什么 KV cache 改变的是效率而不是任务定义
- 为什么 perplexity、验证损失和固定 prompt 样例应该一起看
- 为什么极小样本过拟合测试是最有价值的链路健康检查之一
