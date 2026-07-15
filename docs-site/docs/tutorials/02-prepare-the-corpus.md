---
title: 02. 准备语料与数据管线
group:
  title: 复刻教程
  order: 0
order: 1
toc: content
---

import { Callout } from '../../src/components/Callout';

# 02. 准备语料与数据管线

## 本章目标

把“原始文本”变成“后续 tokenizer 和训练都能稳定复用的数据准备链路”。完成后你应该有：

- 数据下载函数
- 文本规范化逻辑
- token 打包函数
- 保存打包结果的基础工具

## 你将新增或修改哪些文件

```text
src/phoenix_mini_llm/data/download.py
src/phoenix_mini_llm/data/normalize.py
src/phoenix_mini_llm/data/pack.py
src/phoenix_mini_llm/data/dataset.py
src/phoenix_mini_llm/config.py
src/phoenix_mini_llm/cli/prepare_data.py
tests/data/test_pack.py
```

## 推荐实现顺序

1. 先在 `config.py` 里定义 `DatasetConfig` 和 `ProjectPaths`。
2. 再写 `download.py`，只负责从 TinyStories 取出原始文本列表。
3. 写 `normalize.py`，把空白和空字符串处理掉。
4. 写 `pack.py`，实现固定长度打包。
5. 最后让 `prepare_data.py` 把这几步串起来。

## 关键实现解释

### 1. 下载函数要返回“纯文本列表”

你在这一层不要急着和 tokenizer 或模型耦合。最干净的职责是：

- 输入：数据集配置、split 名称
- 输出：`list[str]`

这样后面 tokenizer 和打包逻辑都能专注处理文本本身。

### 2. 规范化函数要尽量简单

本项目不是做复杂清洗平台，所以规范化只做：

- `strip()`
- 去掉空串
- 统一换行与空白

过早引入复杂文本规则，只会增加 debug 面积。

### 3. `pack_token_sequences` 要围绕 `seq_len + 1`

这是最容易写错的地方。因为训练目标要右移一位，所以打包长度不是纯粹的 `seq_len`，而是 `seq_len + 1`。

## 本章最小函数轮廓

```python
def download_tinystories_subset(config: DatasetConfig, split: str) -> list[str]:
    ...

def normalize_story_batch(texts: list[str]) -> list[str]:
    ...

def pack_token_sequences(
    sequences: list[list[int]],
    sequence_length: int,
    bos_token_id: int,
    eos_token_id: int,
) -> np.ndarray:
    ...
```

## 常见错误

- 在下载阶段就把逻辑和 tokenizer 强耦合。
- 直接把不定长序列拿去训练，而不做固定长度打包。
- 忘了给序列加 `bos` / `eos`。

<Callout title="相关踩坑" tone="warning">
  如果你在子集规模或流式数据集行为上拿不准，读 [03. 流式数据集与子集规模](/pitfalls/03-streaming-datasets-and-prep-scale)。
</Callout>

## 本章完成后如何检查

1. 下载函数能返回固定数量的训练和验证文本。
2. 文本规范化后没有空字符串。
3. 打包函数输出的数组 shape 是 `[num_chunks, seq_len + 1]`。
4. `tests/data/test_pack.py` 能覆盖最小打包边界。

## 建议本地检查点名称

`tutorial-step-02`
