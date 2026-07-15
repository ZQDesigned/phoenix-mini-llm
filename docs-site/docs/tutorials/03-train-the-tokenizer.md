---
title: 03. 训练 Tokenizer
group:
  title: 复刻教程
  order: 0
order: 2
toc: content
---

import { Callout } from '../../src/components/Callout';

# 03. 训练 Tokenizer

## 本章目标

把上一章准备好的文本变成真正可用的 token id，并把 tokenizer 工件和元数据持久化下来。完成后你应该有：

- 一个 BPE tokenizer
- `tokenizer.json`
- special token id 元数据
- 训练集和验证集的 token 序列

## 你将新增或修改哪些文件

```text
src/phoenix_mini_llm/data/tokenizer.py
src/phoenix_mini_llm/cli/prepare_data.py
tests/data/test_tokenizer.py
```

## 推荐实现顺序

1. 先定义 `TokenizerConfig` 和 `TokenizerArtifacts`。
2. 写 `train_bpe_tokenizer()`。
3. 写 `load_tokenizer()`。
4. 在 `prepare_data.py` 里接入 tokenizer 训练和 `encode_batch()`。
5. 把 special token id 和语料统计写进 metadata。

## 为什么这样设计

### 1. 训练和加载要分成两个函数

因为你后续会重复使用 tokenizer：

- 数据准备阶段要训练
- 生成阶段要加载
- 评估阶段也要加载

如果把这些逻辑混在一个函数里，后面几乎一定会反复复制代码。

### 2. special token id 必须写入 metadata

很多初学项目能成功 encode/decode，但后面在模型配置里写错 `bos/eos/pad/unk` 的 id，导致训练和生成语义错位。最稳妥的方式，就是在准备数据时把这组 id 固定保存下来。

## 关键实现轮廓

```python
def train_bpe_tokenizer(
    texts: list[str],
    config: TokenizerConfig,
    output_dir: str | Path,
) -> TokenizerArtifacts:
    ...
```

典型流程是：

1. 构建 `BPE(unk_token=...)`
2. 设置 `ByteLevel` pre-tokenizer 和 decoder
3. 用 `BpeTrainer` 训练
4. 保存 `tokenizer.json`
5. 从词表里取回 special token id

## 关键命令

当 `prepare_data.py` 已经把下载、规范化、tokenizer 训练和打包串起来后，你可以执行：

```bash
uv run phoenix-prepare-data --config configs/debug.toml
```

成功后至少应该得到：

- `artifacts/tokenizer/tokenizer.json`
- `data/train.npy`
- `data/validation.npy`
- 一份 metadata JSON

## 常见错误

- special tokens 定义了，但没有验证对应 id 是否真的存在词表中。
- tokenizer 训练完后没有把 train/validation 都用同一份 tokenizer 编码。
- metadata 写了 `vocab_size`，却没记录 special token id。

<Callout title="相关踩坑" tone="warning">
  如果 tokenizer 工件和 metadata 不同步，后面模型配置会非常容易出错。对应案例见 [04. Tokenizer 元数据同步](/pitfalls/04-tokenizer-metadata-sync)。
</Callout>

## 本章完成后如何检查

1. `tokenizer.json` 文件存在。
2. `tokenizer.encode_batch()` 能对训练和验证文本都正常返回 id。
3. metadata 中同时记录了语料规模、词表大小和 special token id。
4. `tests/data/test_tokenizer.py` 至少覆盖 round-trip 或基本工件结构。

## 建议本地检查点名称

`tutorial-step-03`
