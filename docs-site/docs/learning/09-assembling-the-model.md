---
title: 09. 把模型拼起来
group:
  title: 学习主线
  order: 0
order: 8
toc: content
---

import { Callout } from '../../src/components/Callout';

# 09. 把模型拼起来

## 这一章要解决什么问题

前面几章你学到的还是“部件级”知识。现在要做的是把这些部件拼成一个真正可训练的 decoder-only 模型：输入进来之后先经过什么，再经过什么，最后损失是如何得到的。

## 你需要先知道什么

- embedding、token 序列和 shape
- self-attention 与 Transformer Block
- 训练目标和 cross-entropy

## 核心概念

### 1. 整体前向路径

一个最常见的 decoder-only 模型前向路径可以概括成：

```text
input_ids
-> token embedding
-> dropout
-> N 个 Transformer Block
-> final norm
-> lm head
-> logits
```

如果提供 `targets`，再进一步计算 loss。

### 2. `ModuleList` 的作用是堆叠 block

在 PyTorch 里，你不会手写 `block1`, `block2`, `block3` ...，而是把很多 block 放进 `nn.ModuleList` 里，然后在前向传播中循环调用。

这样做的好处是：

- 代码更简洁
- 参数自动注册
- 层数可以通过配置控制

### 3. 输入 embedding 和输出头可以共享权重

很多语言模型会让：

- token embedding 矩阵
- lm head 权重矩阵

共享同一份参数。这样做常被叫做 weight tying。

好处包括：

- 减少参数量
- 在很多场景下有不错的经验效果

### 4. 模型配置不是装饰，它定义了算力边界

像这些参数都会直接影响显存和训练代价：

- `hidden_size`
- `num_layers`
- `num_heads`
- `intermediate_size`
- `max_seq_len`
- `vocab_size`

学习项目里，配置不是“越大越好”，而是要和你的硬件预算相匹配。

## 最小必要数学

### 输出 logits 的形状

如果最终隐藏状态是：

\[
[batch, seq, hidden]
\]

输出头把最后一维映射到词表大小后，logits 就会变成：

\[
[batch, seq, vocab]
\]

这正好对应“每个位置都要对整个词表给一组分数”。

## 最小代码实验

下面这段精简版结构，已经很接近真实模型骨架：

```python
class TinyLM(nn.Module):
    def __init__(self, vocab_size, hidden_size, num_layers):
        super().__init__()
        self.token_embeddings = nn.Embedding(vocab_size, hidden_size)
        self.blocks = nn.ModuleList([Block(hidden_size) for _ in range(num_layers)])
        self.final_norm = nn.LayerNorm(hidden_size)
        self.lm_head = nn.Linear(hidden_size, vocab_size, bias=False)

    def forward(self, input_ids):
        hidden = self.token_embeddings(input_ids)
        for block in self.blocks:
            hidden = block(hidden)
        hidden = self.final_norm(hidden)
        return self.lm_head(hidden)
```

真正的 `phoenix-mini-llm` 会更完整，但阅读时你应该能在脑中把它还原回这条基本路径。

## 常见误区

### 误区 1：模型结构只要“像 Transformer”就行

不够。你还要检查：

- shape 是否一致
- loss 是否基于正确的 logits 和 targets
- 配置是否与 tokenizer 元数据兼容

### 误区 2：参数规模只看层数

参数量不仅跟层数有关，还跟 hidden size、词表大小、FFN 中间维度等因素一起决定。

### 误区 3：只关心能不能 forward，不关心显存

在 6GB 级别显存约束下，`max_seq_len` 和 activation 内存同样重要。模型能“实例化成功”不等于它能顺利训练。

<Callout title="现在你已经接近完整代码了" tone="success">
  读到这里，你应该能把模型源码拆成“embedding、block 堆叠、归一化、输出头、loss”这几个职责，而不是把整个文件看成一个不可分解的类定义。
</Callout>

## 练习题

1. 为什么最终 logits 的最后一维必须等于词表大小？
2. `ModuleList` 在堆叠 block 时解决了什么问题？
3. 为什么学习项目必须同时关注模型结构和显存预算？

## 下一章会用到什么

下一章会从“模型已经存在”切换到“如何稳定训练它”：DataLoader、梯度累积、AMP、checkpoint 和验证集评估都会在那一章出现。
