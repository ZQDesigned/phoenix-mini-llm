from __future__ import annotations


def normalize_story_text(text: str) -> str:
    normalized = text.replace("\r\n", "\n").replace("\r", "\n").strip()
    return "\n".join(line.rstrip() for line in normalized.splitlines())


def normalize_story_batch(texts: list[str]) -> list[str]:
    return [normalize_story_text(text) for text in texts if normalize_story_text(text)]
