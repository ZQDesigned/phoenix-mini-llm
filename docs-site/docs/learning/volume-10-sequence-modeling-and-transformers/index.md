---
title: 卷十 从 Attention 到完整的 Decoder-only Transformer
group:
  title: 卷十 从 Attention 到完整的 Decoder-only Transformer
  order: 10
toc: content
---

# 卷十 从 Attention 到完整的 Decoder-only Transformer

> 本卷属于第四编“序列建模、注意力与 Transformer”，负责把读取问题继续推进成 QKV、causal mask、位置方法与完整 decoder-only 主体结构。

经过上一卷，你已经知道：

- 序列问题的难点不只是“更长”
- 早期顺序式结构会在长依赖和信息压缩上碰到瓶颈
- attention 出现的根本原因，是当前位置需要按内容去读取历史

从这里开始，整套知识档案才真正进入现代语言模型主体结构。

但即使到了这里，也仍然不能把 Transformer 学成一张组件清单。

本卷真正要回答的是：

> 当“按内容读取历史”成为核心需求之后，一台现代 decoder-only 语言模型为什么会一步步长成今天这样？

## 为什么这一卷不能被学成“QKV 术语表”

初学者最常见的误区，是把 Transformer 学成下面这种模板记忆：

- 有 Query、Key、Value
- 有注意力分数
- 有 mask
- 有位置编码
- 有残差和归一化

这种记忆当然能帮助你认结构图，但它不足以支持真正理解。

因为它没有回答：

- 为什么要分成 Query、Key、Value 三种角色
- 为什么语言模型必须加因果约束
- 为什么 attention 本身不够，还要再加逐位置重写层
- 为什么 block 可以一层层稳定堆叠
- 为什么这些部件恰好能闭合成一台可训练、可生成的 decoder-only 机器

本卷的任务，就是把这些问题按因果顺序串起来。

## 为什么 attention 首先应该被理解成“读取结构”

attention 最稳定的理解方式，不是把它当成“模型理解能力”的神秘来源。

更稳的说法是：

> attention 是一种内容驱动的读取机制，它允许当前位置根据自己的需要，从历史中挑选、加权并取回相关信息。

一旦用这个视角来理解它，很多结构都会自然起来：

- Query 代表当前位置在找什么
- Key 代表每个历史位置怎样被找到
- Value 代表一旦被找到，应该把什么信息带回来

这也是为什么本卷会先把读取逻辑讲透，再去谈 mask、位置与 block 堆叠。

## 为什么语言模型的 attention 必须带因果约束

语言模型和许多其他序列任务最大的区别之一，在于它的目标是：

> 只能根据过去预测未来。

这意味着模型在训练时虽然看见整段序列，却不能在当前位置偷看右边答案。

因此 causal mask 不是实现细节。

它实际上在保护任务定义本身。

如果这一点没有站稳，后面你会很难真正理解：

- 为什么训练和推理可以保持一致
- 为什么自回归生成必须逐步展开
- 为什么 cache 只需要缓存过去

## 为什么位置方法不是“再加一点额外信息”

attention 的强大之处在于按内容读取。

但这也带来一个天然缺口：

> 单靠内容相关性，模型并不会天然知道序列顺序、相对远近和位置几何。

所以位置方法存在的意义，不是给模型附赠一点边角料。

它是在补：

- 谁先谁后
- 谁近谁远
- 哪种相对距离模式值得保留

没有这层补偿，语言模型就很难稳定地把序列本身当成序列来理解。

## 为什么一个 block 不只是在“做一次注意力”

很多结构图会让初学者以为：

- attention 是主角
- FFN 只是顺手加进去的
- residual 和 norm 是训练技巧

这种看法不够准确。

更成熟的理解应该是：

- attention 负责跨位置读取和通信
- FFN 负责逐位置重写和提炼
- residual 负责保留主信息流
- norm 负责让深层堆叠更稳定

也就是说，一个 Transformer block 不是若干杂项的组合。

它是一块可以反复堆叠的表示更新砖块。

## 为什么本卷对后面的训练和推理尤其关键

如果本卷读得不稳，后面你在训练卷和推理卷里会反复遇到黑箱感。

例如，你会知道：

- loss 在下降
- 采样会变输出
- KV cache 会提速

但你仍然未必说得清：

- logits 是从哪些内部结构一路长出来的
- cache 到底缓存的是哪一段读取历史
- 为什么模型的生成行为和因果约束是同一件事的两面

所以本卷实际上是后面运行篇的结构前提。

## 本卷的五章分别在做什么

### 第一章：[01. Query、Key、Value 与加权读取](/learning/volume-10-sequence-modeling-and-transformers/01-query-key-value-and-weighted-reading.md)

这一章真正展开 attention 的读取逻辑：

- 为什么要分三种角色
- 分数怎样变成权重
- 加权读取到底在聚合什么信息

### 第二章：[02. 因果注意力与 mask](/learning/volume-10-sequence-modeling-and-transformers/02-causal-attention-and-masking.md)

这一章把读取机制接回任务约束：

- 为什么不能看未来
- mask 如何把任务语义写进结构
- 训练和生成为什么都离不开这层约束

### 第三章：[03. 位置方法到底在补什么](/learning/volume-10-sequence-modeling-and-transformers/03-what-positional-methods-actually-add.md)

这一章解释：

- attention 缺失了什么
- 位置方法到底在补什么信息
- 为什么“位置”不是一句“告诉模型顺序”就结束的东西

### 第四章：[04. Transformer block 为什么能反复堆叠](/learning/volume-10-sequence-modeling-and-transformers/04-why-transformer-blocks-stack-so-well.md)

这一章把 attention、FFN、residual 与 norm 放回同一块砖里：

- 它们为什么需要一起出现
- 每个部件分别在承担什么职责
- 为什么这样的砖块可以层层堆高

### 第五章：[05. 一个完整 decoder-only 模型怎样组装](/learning/volume-10-sequence-modeling-and-transformers/05-how-a-complete-decoder-only-model-is-assembled.md)

这一章把整机真正闭合：

- token id 怎样进入 embedding
- 表示怎样穿过多层 block
- logits 怎样被吐到词表空间
- 一台完整模型怎样同时服务于训练和生成

## 本卷真正要建立的不是记忆，而是解释力

读完本卷后，最重要的不是你能不能默写结构图。

更重要的是你能否稳定解释下面这些问题：

### 第一，为什么注意力是“读历史”，不是“魔法理解”

这会让你以后看到任何 attention 变体时，都先回到读取职责本身去分析。

### 第二，为什么 decoder-only 结构和语言模型任务是高度贴合的

你会更自然地看到：

- 目标是条件概率预测
- 结构是因果读取
- 推理是逐步生成

这三件事本来就是同一条链。

### 第三，为什么 block 堆叠不是盲目加深

每堆一层，模型都在多获得一次：

- 跨位置读取
- 逐位置重写
- 表示再组织

## 本卷之后去哪里

读完本卷，最自然的下一步就是进入：

- [卷十一. 训练一个小型语言模型](/learning/volume-11-training-a-small-language-model/index.md)

因为到这时，你已经知道模型主体怎样从 token 一路走到 logits。

下一步就该回答：

- 这台模型怎样在真实数据上逐步学出来
- 为什么训练会受 batch、显存、数值稳定性和实验管理共同塑形
- 为什么真正的困难会从静态结构转向动态过程
