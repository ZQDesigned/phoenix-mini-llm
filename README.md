# phoenix-mini-llm

`phoenix-mini-llm` is a small decoder-only language model project built for learning. The codebase is designed so a beginner can read the whole stack: dataset preparation, tokenizer training, model definition, training loop, checkpointing, and text generation.

## Planned Workflow

1. Prepare a TinyStories subset and train a small BPE tokenizer.
2. Pack tokens into fixed-length language-modeling sequences.
3. Train a decoder-only Transformer with cross-platform device handling.
4. Evaluate checkpoints and generate sample text.
5. Study the standalone documentation site for theory, pitfalls, and a reproducible tutorial.

## Repository Layout

```text
.
├── configs/
├── scripts/
├── src/
│   └── phoenix_mini_llm/
├── tests/
└── README.md
```

## Tooling

- Dependency management: `uv`
- Runtime: Python 3.12
- Deep learning: PyTorch
- Tokenizer: Hugging Face `tokenizers`
- Dataset access: Hugging Face `datasets`
- Quality checks: `pytest`, `ruff`, `pyright`
