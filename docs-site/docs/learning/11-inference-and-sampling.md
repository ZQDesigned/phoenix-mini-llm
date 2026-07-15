---
title: 11. 推理与采样
group:
  title: 学习主线
  order: 0
order: 10
toc: content
---

import { Callout } from '../../src/components/Callout';

# 11. 推理与采样

## 这一章要解决什么问题

训练结束后，模型不会自动“变成会说话的程序”。你还需要决定如何把 logits 变成具体 token，并且让生成过程在速度和文本质量之间取得平衡。

## 你需要先知道什么

- 理解 logits 和 cross-entropy。
- 知道训练阶段使用 teacher forcing，而推理阶段只能自回归生成。

## 核心概念

### 1. 推理是“滚动式”的

推理时没有真实下一个 token 可以喂给模型，所以流程变成：

1. 给一个 prompt
2. 模型预测下一个 token
3. 把这个 token 接回输入末尾
4. 再预测下一个

这就是自回归生成。

### 2. greedy decoding 总是选当前概率最大的 token

优点：

- 简单
- 可重复
- 稳定

缺点：

- 容易陷入重复
- 文本多样性差

### 3. temperature 控制分布“尖不尖”

- 温度低：更保守，更偏向高概率 token
- 温度高：更随机，探索更多候选

它不是“创造力滑块”，而是对 logits 分布的尺度调节。

### 4. top-k 和 top-p 是两种截断策略

- `top-k`：只保留概率最高的前 `k` 个 token
- `top-p`：保留累计概率达到 `p` 的最小 token 集合

它们的共同目标是避免从极低概率尾部随便抽样。

### 5. KV cache 是为了避免重复算旧上下文

如果每次生成一个新 token 都把全部历史重新跑一遍，代价会很高。KV cache 的思路是：

- 过去位置的 key/value 算一次后缓存起来
- 新 token 来时只补算新位置

这样长文本生成会快很多。

## 最小必要数学

### temperature 调整

给 logits 除以温度：

\[
\text{softmax}(z / T)
\]

其中：

- `T < 1`：分布更尖锐
- `T > 1`：分布更平坦

## 最小代码实验

```python
import torch

logits = torch.tensor([2.0, 1.0, 0.1])
temperature = 0.7
probs = torch.softmax(logits / temperature, dim=-1)
print(probs)
```

你可以把 `temperature` 改成 `1.5` 再观察，会看到概率分布变得更平。

## 常见误区

### 误区 1：采样只影响“文风”，不影响错误率

采样策略不仅影响多样性，也会影响重复、胡言乱语和退化输出的概率。

### 误区 2：temperature 越高越好玩

温度过高会让输出迅速失控。学习项目里更有价值的是理解它为什么会失控，而不是一味提高随机性。

### 误区 3：KV cache 是可有可无的小优化

对很短生成来说差别也许不大，但只要上下文一长，KV cache 就会明显影响延迟和资源占用。

<Callout title="和当前项目的接口关系" tone="note">
  `phoenix-mini-llm` 的生成逻辑会把采样函数和滚动生成逻辑拆开实现，这样你可以单独测试 top-k、top-p 和温度行为，而不是把所有决策都塞进一个大函数里。
</Callout>

## 练习题

1. greedy decoding 为什么容易产生重复？
2. `top-k` 和 `top-p` 的差别是什么？
3. 为什么 KV cache 能减少重复计算？

## 下一章会用到什么

最后一章会把训练和推理中最常见的问题串起来：如何从损失曲线、输出样例和设备差异中判断一个项目到底哪里出了问题。
