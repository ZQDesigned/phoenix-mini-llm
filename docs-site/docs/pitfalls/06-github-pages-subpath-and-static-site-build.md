---
title: 06. GitHub Pages 子路径与静态站点构建
toc: content
---

# 06. GitHub Pages 子路径与静态站点构建

## 发生背景

`docs-site` 最终要发布到 GitHub Pages，而项目仓库不是用户根域名主页，而是：

```text
https://<user>.github.io/phoenix-mini-llm/
```

这意味着站点不是部署在根路径 `/`，而是部署在仓库名对应的子路径下。

## 现象

只要文档站生成器没有意识到自己部署在仓库子路径下，常见后果都差不多：

- 首页能打开，但静态资源 404
- 子页面样式、脚本或图片路径错误
- 刷新子页面直接白屏或 404

## 一开始的错误判断

这种问题很容易被误判成：

- 打包产物损坏
- GitHub Pages 服务异常
- 文档框架本身有 bug

但真正的问题通常只是部署路径配置不对。

## 最终原因

部署到 GitHub Pages 子路径时，站点生成器必须知道自己的公开根路径不是 `/`，而是类似：

```text
/phoenix-mini-llm/
```

## 修复方式

在 MkDocs 配置里显式声明最终站点地址：

```yaml
site_url: https://zqdesigned.github.io/phoenix-mini-llm/
```

然后在 GitHub Actions 里使用真正的静态构建输出目录进行发布，例如：

```yaml
with:
  path: docs-site/site
```

## 如何避免再次踩坑

1. 本地开发服务器可用，不代表 GitHub Pages 子路径就一定正确。
2. 只要站点不是部署在域名根路径，就优先检查 `site_url`、静态资源引用和输出目录。
3. 如果站点要显示最后更新时间，工作流里仍然要保留 `fetch-depth: 0`。

> **部署类问题的特点**
>
>   这类问题通常不是页面内容写错了，而是静态站点生成和托管环境之间的路径约定没有对齐。
