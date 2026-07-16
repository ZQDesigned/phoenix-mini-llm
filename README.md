# phoenix-mini-llm

`phoenix-mini-llm` is a small decoder-only language model project built for learning. The codebase is designed so a beginner can read the whole stack: dataset preparation, tokenizer training, model definition, training loop, checkpointing, and text generation.

## Workflow

1. Prepare a TinyStories subset and train a small BPE tokenizer.
2. Pack tokens into fixed-length language-modeling sequences.
3. Train a decoder-only Transformer with cross-platform device handling.
4. Evaluate checkpoints and generate sample text.
5. Study the in-repository documentation site for the learning track, build-from-zero tutorial, and pitfalls timeline.

## Quick Start

```bash
~/.local/bin/uv sync --python 3.12
~/.local/bin/uv run phoenix-prepare-data --config configs/debug.toml
~/.local/bin/uv run phoenix-train --config configs/debug.toml
~/.local/bin/uv run phoenix-evaluate --config configs/debug.toml --checkpoint latest
~/.local/bin/uv run phoenix-generate --config configs/debug.toml --checkpoint latest --prompt "Once upon a time"
```

If `uv` is already in your shell PATH, you can drop the explicit `~/.local/bin/` prefix.

## Repository Layout

```text
.
├── configs/
├── data/                # generated, ignored
├── artifacts/           # generated, ignored
├── checkpoints/         # generated, ignored
├── runs/                # generated, ignored
├── scripts/
├── src/
│   └── phoenix_mini_llm/
├── docs-site/
├── tests/
└── README.md
```

## Config Profiles

- `configs/debug.toml`: smallest runnable path for smoke tests and local verification
- `configs/dev.toml`: larger local run for feature validation and iteration
- `configs/train.toml`: intended starting point for Windows + CUDA training

## Main Entry Points

- `phoenix-prepare-data`: download a TinyStories subset, train the tokenizer, and write packed `.npy` shards
- `phoenix-train`: train the model, evaluate periodically, and write checkpoints
- `phoenix-evaluate`: compute validation loss for a checkpoint
- `phoenix-generate`: generate text from a checkpoint with top-k/top-p sampling

## Documentation Site

The Material for MkDocs documentation site lives inside this repository at:

```text
docs-site/
```

It contains:

- `learning/`: a linear beginner curriculum
- `tutorials/`: a stage-by-stage rebuild guide
- `pitfalls/`: a chronological engineering log

Typical site commands:

```bash
cd docs-site
~/.local/bin/uv sync --python 3.12
~/.local/bin/uv run mkdocs serve
~/.local/bin/uv run mkdocs build --strict
```

## Tooling

- Dependency management: `uv`
- Runtime: Python 3.12
- Deep learning: PyTorch
- Tokenizer: Hugging Face `tokenizers`
- Dataset access: Hugging Face `datasets`
- Quality checks: `pytest`, `ruff`, `pyright`
