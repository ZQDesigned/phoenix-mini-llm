---
title: 10. 跑出仓库对齐的基线结果
group:
  title: 复刻教程
  order: 0
order: 9
toc: content
---

# 10. 跑出仓库对齐的基线结果

## 本章目标

这一章不是再介绍新代码，而是把前面 9 章产物真的跑起来，确认你做出的工程和当前仓库在运行路径上对齐。完成后，你应该能独立完成：

- `debug` 配置的全链路 smoke run。
- `dev` 配置的较完整本地实验。
- `train` 配置的正式训练准备。
- checkpoint 恢复、评估和生成。

## 先明确“复现成功”是什么意思

这里的“复现”不是指：

- 每一步 loss 数值逐位相同。
- 每次生成都输出完全一样的句子。

这里的“复现成功”指的是：

- 目录结构一致。
- 训练、评估、生成命令一致。
- 产物文件命名与位置一致。
- 模型规模与配置一致。
- 训练趋势、checkpoint 节奏与推理链路一致。

## 第一步：从 `debug` 配置做全链路 smoke run

先执行：

```bash
uv run phoenix-prepare-data --config configs/debug.toml
uv run phoenix-train --config configs/debug.toml
uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
uv run phoenix-generate --config configs/debug.toml --checkpoint latest --prompt "Once upon a"
```

### `debug` 配置的预期特征

- 数据规模最小。
- 模型只有 `2` 层、`hidden_size=128`。
- 训练总步数只有 `20`。
- checkpoint 应该在第 `10` 步和第 `20` 步保存。

跑完后，你至少应该看到：

```text
artifacts/tokenizer/tokenizer.json
artifacts/prepare_metadata.json
data/train.npy
data/validation.npy
checkpoints/debug/step-000010.pt
checkpoints/debug/step-000020.pt
runs/debug/train_summary.json
```

## 第二步：检查 `train_summary.json`

训练总结文件应该出现在：

```text
runs/debug/train_summary.json
```

它至少包含：

```json
{
  "step": 20,
  "last_train_loss": 6.3,
  "best_eval_loss": 6.1
}
```

具体数值会浮动，但：

- `step` 应该等于配置里的 `max_steps`
- `best_eval_loss` 应该是一个有限正数
- 整个训练过程不应出现 NaN

## 第三步：验证 `latest` checkpoint 解析是否正确

当前项目允许：

```bash
uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
```

这依赖于 `resolve_checkpoint_path()` 在 `checkpoints/<run_name>/` 下自动选择最后一个 `step-*.pt` 文件。你可以额外验证：

```bash
uv run python - <<'PY'
from phoenix_mini_llm.cli.common import resolve_checkpoint_path
from phoenix_mini_llm.config import load_run_config

config = load_run_config("configs/debug.toml")
print(resolve_checkpoint_path(config, "latest"))
PY
```

## 第四步：继续跑 `dev` 配置

当 `debug` 已经稳定后，执行：

```bash
uv run phoenix-prepare-data --config configs/dev.toml
uv run phoenix-train --config configs/dev.toml
```

### `dev` 配置的意义

- 数据量更大。
- 模型变成 `4` 层、`hidden_size=256`。
- 训练步数增加到 `200`。
- 更适合在 Mac 本地或轻量 GPU 上观察完整链路是否稳定。

如果 `debug` 能跑但 `dev` 出问题，通常说明：

- 数据量一增大就暴露出 shape / 内存问题。
- 梯度累积、评估间隔或 checkpoint 间隔逻辑有 bug。

## 第五步：理解 `train` 配置代表的是真实训练约束

`configs/train.toml` 对应的是正式训练起点：

- `hidden_size = 384`
- `num_layers = 6`
- `num_heads = 6`
- `max_seq_len = 256`
- `gradient_accumulation_steps = 8`
- `amp = true`
- `max_steps = 2000`

这套配置更接近你在 Windows CUDA 环境中真正要跑的实验。你不一定要现在一次跑完，但必须确认：

- 数据准备命令可执行
- 训练入口参数正确
- 目录和 checkpoint 节奏正确

## 第六步：验证恢复训练

当前项目训练入口支持：

```bash
uv run phoenix-train --config configs/debug.toml --resume latest
```

这意味着你应该能：

1. 先跑出一个中间 checkpoint。
2. 中断训练。
3. 通过 `--resume latest` 从最近 checkpoint 继续。

对正式实验来说，这不是附加功能，而是必要功能。

## 第七步：验证生成链路

在 `debug` 或 `dev` checkpoint 可用后，尝试不同 prompt：

```bash
uv run phoenix-generate --config configs/debug.toml --checkpoint latest --prompt "The phoenix"
uv run phoenix-generate --config configs/debug.toml --checkpoint latest --prompt "In a tiny village"
```

你现在关注的不是“文本是否像产品级模型那样自然”，而是：

- prompt 能否被编码
- 模型能否连续生成
- EOS 终止逻辑是否有效
- top-k / top-p / temperature 的接口是否工作

## 最后一轮总验收

在你认为自己已经复现完成之后，至少做一次完整检查：

```bash
uv run pytest
uv run ruff check .
uv run pyright
uv run phoenix-prepare-data --config configs/debug.toml
uv run phoenix-train --config configs/debug.toml
uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
uv run phoenix-generate --config configs/debug.toml --checkpoint latest --prompt "Once upon a"
```

如果这一整套都稳定通过，你就已经不只是“会运行这个仓库”，而是真正重新构造出了它。

## 常见误判

### 误判 1：只要生成出一句话就算复现成功

不对。你还需要确认：

- 配置规模一致
- checkpoint 节奏一致
- 训练与评估命令一致
- 测试与静态检查都通过

### 误判 2：本地 `debug` 跑通就等于正式训练没问题

不对。`debug` 只证明链路正确，不证明显存、吞吐、混合精度、长上下文都没问题。

### 误判 3：跨平台 loss 不逐位一致就是错误

Mac MPS 和 Windows CUDA 不会保证每一步浮点结果完全一样。真正应该追求的是：

- 训练趋势合理
- 评估损失有限且可下降
- 生成链路稳定

<Callout title="最常见的误判" tone="warning">
  如果你把“跑起来一次”误当成“已经完成复刻”，你后面一旦要改结构、调参数或 debug，就会发现自己并没有真正掌握这个工程。复刻成功的标准，是你知道每个文件为什么存在、每条命令为什么这么写、每个工件后面依赖哪段代码。
</Callout>

## 本章完成后的阶段检查点

```bash
git add .
git commit -m "tutorial-step-10"
```

## 到这里你应该具备什么能力

当你按顺序完成这 10 章之后，你应该已经能够：

- 从空目录搭出与当前仓库同构的小型语言模型工程。
- 理解数据、Tokenizer、模型、训练、推理各层之间的接口。
- 在 Mac 开发 / Windows 训练的跨平台约束下维护项目。
- 独立定位大部分训练、配置、路径与推理阶段问题。

如果你在某一层仍然觉得“不知道为什么这样写”，不要回去复制仓库代码，而是回到对应的 [学习主线](/learning) 章节，把那一层的原理重新补牢。
