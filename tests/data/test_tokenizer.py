from __future__ import annotations

from pathlib import Path

from phoenix_mini_llm.config import TokenizerConfig
from phoenix_mini_llm.data.tokenizer import load_tokenizer, train_bpe_tokenizer


def test_train_bpe_tokenizer_persists_tokenizer_and_special_tokens(tmp_path: Path) -> None:
    texts = [
        "The phoenix wakes at dawn.",
        "The phoenix learns from tiny stories.",
        "Tiny stories help the phoenix model speak.",
    ]
    config = TokenizerConfig(
        vocab_size=64,
        min_frequency=1,
        special_tokens=["<pad>", "<bos>", "<eos>", "<unk>"],
    )

    artifacts = train_bpe_tokenizer(texts=texts, config=config, output_dir=tmp_path)
    tokenizer = load_tokenizer(artifacts.tokenizer_path)
    encoded = tokenizer.encode("The phoenix wakes.")

    assert artifacts.tokenizer_path.exists()
    assert artifacts.pad_token_id == 0
    assert artifacts.bos_token_id == 1
    assert artifacts.eos_token_id == 2
    assert artifacts.unk_token_id == 3
    assert len(encoded.ids) > 0
