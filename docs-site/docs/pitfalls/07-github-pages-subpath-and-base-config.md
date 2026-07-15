---
title: 07. GitHub Pages 子路径构建
toc: content
---

import { Callout } from '../../src/components/Callout';

# 07. GitHub Pages 子路径构建

## 发生背景

`docs-site` 最终要发布到 GitHub Pages，而项目仓库不是用户根域名主页，而是：

```text
https://<user>.github.io/phoenix-mini-llm/
```

这意味着站点不是部署在根路径 `/`，而是部署在仓库名对应的子路径下。

## 现象

如果 `dumi` 的 `base` 和 `publicPath` 仍然保持默认值 `/`，常见后果包括：

- 首页能打开，但静态资源 404
- 页面路由跳转后样式丢失
- 刷新子页面直接白屏或 404

## 一开始的错误判断

这种问题很容易被误判成：

- 打包产物损坏
- GitHub Pages 服务异常
- 前端框架路由本身有 bug

但真正的问题通常只是部署路径配置不对。

## 最终原因

部署到 GitHub Pages 子路径时，静态资源引用和路由生成都必须知道自己的公共根路径不是 `/`，而是类似：

```text
/phoenix-mini-llm/
```

## 修复方式

在 `docs-site/.dumirc.ts` 中显式配置：

```ts
const docsBase = process.env.DOCS_SITE_BASE || '/';

export default defineConfig({
  base: docsBase,
  publicPath: docsBase,
});
```

然后在 GitHub Actions 里注入：

```yaml
env:
  DOCS_SITE_BASE: /${{ github.event.repository.name }}/
```

## 如何避免再次踩坑

1. 本地预览成功，不代表 Pages 子路径也一定成功。
2. 只要站点不是部署在域名根路径，就优先检查 `base` 和 `publicPath`。
3. 对需要显示最后更新时间的站点，还要记得在 checkout 时加 `fetch-depth: 0`。

<Callout title="部署类问题的特点" tone="warning">
  这类问题通常不是页面内容写错了，而是静态站点生成和托管环境之间的路径约定没有对齐。
</Callout>
