---
title: 05. 从文本到 Token
group:
  title: 学习主线
  order: 0
order: 4
toc: content
---

# 05. 从文本到 Token

## 这一章要解决什么问题

模型不能直接“吃字符串”。在进入 embedding 之前，文本必须先经历一套数据预处理和 tokenization 流程。很多初学者把 tokenizer 当成前置杂务，但它其实决定了模型观察世界的最小单位。

## 你需要先知道什么

- 理解训练目标是预测下一个 token。
- 已经知道 token 不是天然存在，而是 tokenizer 划分出来的单位。

## 核心概念

### 1. 语料不是越大越好，先要可控

在学习项目里，最重要的不是一上来喂海量语料，而是：

- 数据来源清楚
- 文本字段明确
- 训练/验证切分稳定
- 规模足够你快速迭代

`phoenix-mini-llm` 选择 TinyStories 的原因正是它适合作为小模型学习语料。

### 2. 文本预处理是在减少无意义噪声

常见的规范化动作包括：

- 去掉首尾多余空白
- 统一换行
- 过滤空字符串

预处理不是为了“美化文本”，而是为了避免 tokenizer 和打包逻辑接收到大量无效输入。

### 3. BPE 的核心思想是“从常见片段里长出子词”

Byte Pair Encoding 不会直接假设“词”是最小单位。它会从较小片段开始，不断合并高频相邻对，逐步长出更常见的子词单位。

这样做的好处是：

- 词表规模更可控
- 生僻词也能拆成已知片段
- 比纯字符级建模更接近现代语言模型实践

### 4. special tokens 不是可有可无

这个项目至少要求：

- `pad`
- `bos`
- `eos`
- `unk`

它们分别对应：

- 补齐长度
- 序列开始
- 序列结束
- 未知 token

### 5. pack sequence 是为了把一堆不定长文本变成固定训练样本

训练时你不能每次都给模型一个任意长度的列表。常见做法是：

1. 把每条文本编码成 token id 序列
2. 给每条序列加上 `bos` 和 `eos`
3. 把所有 token 摊平
4. 重新切成固定长度的块

## 最小必要数学

这章的数学很少，但有一个很重要的长度关系：

如果训练上下文长度是 `L`，那么每个训练样本通常会包含 `L + 1` 个 token。

原因是：

- 前 `L` 个 token 作为输入
- 后 `L` 个 token 作为目标

也就是输入和目标要错开一个位置。

## 最小代码实验

下面这个例子模拟“加特殊 token 再打包”：

```python
def pack_token_sequences(sequences, seq_len, bos_id, eos_id):
    flattened = []
    for seq in sequences:
        flattened.extend([bos_id, *seq, eos_id])

    chunk_size = seq_len + 1
    usable = len(flattened) // chunk_size * chunk_size
    return flattened[:usable]

sample = [[10, 11, 12], [20, 21]]
print(pack_token_sequences(sample, seq_len=4, bos_id=1, eos_id=2))
```

这里最容易忽略的一点是：固定块长度不是 `seq_len`，而是 `seq_len + 1`，因为训练目标需要整体右移一格。

## 常见误区

### 误区 1：Tokenizer 只是“附属品”

不是。词表大小、special tokens、预处理规则、编码方式都会直接影响训练效率和生成效果。

### 误区 2：词表越大越好

词表变大能减少拆分，但 embedding 层和输出层也会变大，训练代价会随之上升。学习项目里更重要的是平衡，而不是盲目扩大。

### 误区 3：只要能 encode/decode 就算完成

还不够。你还必须确保：

- special token id 被正确记录
- train/validation 使用同一个 tokenizer
- metadata 与实际生成的工件同步

<Callout title="和当前项目最相关的点" tone="note">
  在 `phoenix-mini-llm` 里，数据准备脚本会先下载 TinyStories 子集、做文本规范化、训练 BPE tokenizer，再把训练集和验证集分别打包成 `.npy` 文件。
</Callout>

## 练习题

1. 为什么固定长度语言模型样本通常要用 `seq_len + 1` 个 token 来打包？
2. `bos` 和 `eos` 分别解决了什么问题？
3. 为什么学习项目不应该直接跳到海量语料和超大词表？

## 下一章会用到什么

下一章会把这些 token 序列送进语言模型目标函数，正式说明“输入右移一位、目标左移一位”这件事在训练中意味着什么。
