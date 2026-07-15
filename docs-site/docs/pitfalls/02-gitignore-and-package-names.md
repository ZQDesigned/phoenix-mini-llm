---
title: 2. .gitignore 误伤 data 包
group:
  title: 开发早期
  order: 0
order: 2
toc: content
---

# 2. .gitignore 误伤 data 包

## 现象

根目录 `.gitignore` 使用了 `data/`，结果把 `src/phoenix_mini_llm/data` 和 `tests/data` 一并忽略了。

## 根因

没有把规则锚定在仓库根目录，导致同名目录在更深层级也被匹配。

## 正确写法

```gitignore
/data/
/artifacts/
/runs/
/checkpoints/
/outputs/
```

## 经验

只要你的源码或测试里有叫 `data`、`dist`、`build` 的包名，就应该优先写根路径锚定规则。
