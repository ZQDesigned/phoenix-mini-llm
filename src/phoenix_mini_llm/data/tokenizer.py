from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, cast

from tokenizers import Tokenizer
from tokenizers.decoders import ByteLevel as ByteLevelDecoder
from tokenizers.models import BPE
from tokenizers.pre_tokenizers import ByteLevel
from tokenizers.trainers import BpeTrainer

from phoenix_mini_llm.config import TokenizerConfig


@dataclass(slots=True)
class TokenizerArtifacts:
    tokenizer_path: Path
    pad_token_id: int
    bos_token_id: int
    eos_token_id: int
    unk_token_id: int


def train_bpe_tokenizer(
    texts: list[str],
    config: TokenizerConfig,
    output_dir: str | Path,
) -> TokenizerArtifacts:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    tokenizer = Tokenizer(BPE(unk_token=config.special_tokens[3]))
    tokenizer_config: Any = tokenizer
    tokenizer_config.pre_tokenizer = ByteLevel(add_prefix_space=False)
    tokenizer_config.decoder = ByteLevelDecoder()
    trainer = cast(Any, BpeTrainer)(
        vocab_size=config.vocab_size,
        min_frequency=config.min_frequency,
        special_tokens=config.special_tokens,
    )
    tokenizer.train_from_iterator(texts, trainer=trainer)

    tokenizer_path = output_path / "tokenizer.json"
    tokenizer.save(str(tokenizer_path))

    vocab = tokenizer.get_vocab()
    return TokenizerArtifacts(
        tokenizer_path=tokenizer_path,
        pad_token_id=vocab[config.special_tokens[0]],
        bos_token_id=vocab[config.special_tokens[1]],
        eos_token_id=vocab[config.special_tokens[2]],
        unk_token_id=vocab[config.special_tokens[3]],
    )


def load_tokenizer(path: str | Path) -> Tokenizer:
    return Tokenizer.from_file(str(path))
