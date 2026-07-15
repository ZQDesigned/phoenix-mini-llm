---
title: 1. uv 在 PATH 中缺失
group:
  title: 开发早期
  order: 0
order: 1
toc: content
---

# 1. uv 在 PATH 中缺失

## 现象

终端里直接执行 `uv --version` 报 `command not found`，但用户环境实际上已经安装过 `uv`。

## 原因

`uv` 安装在 `~/.local/bin/uv`，当前 shell 没把这个目录放进 PATH。

## 修复

开发过程中临时使用显式路径：

```bash
~/.local/bin/uv sync --python 3.12
```

## 经验

复刻项目时不要只看“装没装包”，还要确认：

- PATH 是否生效
- 项目虚拟环境是否真的由目标 Python 版本创建
