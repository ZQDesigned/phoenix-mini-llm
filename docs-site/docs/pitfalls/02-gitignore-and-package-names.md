---
title: 02. .gitignore 误伤 data 包
toc: content
---

# 02. .gitignore 误伤 data 包

## 发生背景

语言模型项目通常会生成大量数据工件，因此仓库根目录很容易出现类似：

```gitignore
data/
checkpoints/
outputs/
```

的问题在于，如果写法不够精确，它可能连 `src/` 或 `tests/` 里的同名包目录也一起忽略掉。

## 现象

最常见的现象有两类：

1. 你创建了 `src/phoenix_mini_llm/data/`，但 Git 不追踪它。
2. 你在 `tests/data/` 下加了测试文件，Git 状态里却完全看不到。

## 一开始的错误判断

很多人一开始会怀疑：

- 编辑器没保存
- Git 卡住了
- 文件权限不对

但真正的问题往往只是一条 `.gitignore` 写得过于宽泛。

## 最终原因

如果写成：

```gitignore
data/
```

Git 会把任何名为 `data` 的目录都当作忽略目标，而不只是仓库根目录下的生成数据目录。

## 诊断过程

最直接的检查方式是：

```bash
git check-ignore -v src/phoenix_mini_llm/data/__init__.py
git check-ignore -v tests/data/test_pack.py
```

如果输出指向 `.gitignore` 里的 `data/` 规则，就说明规则误伤了源码目录。

## 修复方式

把忽略规则改成只匹配仓库根目录生成目录，例如：

```gitignore
/data/
/checkpoints/
/outputs/
```

开头的 `/` 非常重要，它限定了匹配范围。

## 如何避免再次踩坑

1. 对生成目录的忽略规则尽量使用根目录锚定。
2. 新建 `src/.../data/` 或 `tests/data/` 后，先看一次 `git status`。
3. 发现文件“凭空消失”时，先用 `git check-ignore -v`，不要靠猜。

> **这类问题会直接污染教程体验**
>
>   如果你的复刻教程要求读者创建 `src/.../data/`，但 `.gitignore` 把它吞掉了，读者会误以为自己目录建错了。工程层的小疏忽会直接伤害教学质量。
