import { defineConfig } from 'dumi';

const docsBase = process.env.DOCS_SITE_BASE || '/';
const githubRepo = process.env.GITHUB_REPOSITORY || 'ZQDesigned/phoenix-mini-llm';
const buildHash = process.env.GITHUB_SHA || 'local-build';
const buildTime = new Date().toISOString();
const projectOverviewPath = '/project-overview';

const alibabaSansFonts = [
  {
    weight: 300,
    url: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*1GSgSYDD_aIAAAAAQsAAAAgAegCCAQ/AlibabaSans-Light.woff2',
  },
  {
    weight: 400,
    url: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*2zEUQqnPNesAAAAAQtAAAAgAegCCAQ/AlibabaSans-Regular.woff2',
  },
  {
    weight: 500,
    url: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*E_cxRbMlZqUAAAAAQuAAAAgAegCCAQ/AlibabaSans-Medium.woff2',
  },
  {
    weight: 600,
    url: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*E_cxRbMlZqUAAAAAQuAAAAgAegCCAQ/AlibabaSans-Bold.woff2',
  },
  {
    weight: 700,
    url: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/file/A*E_cxRbMlZqUAAAAAQuAAAAgAegCCAQ/AlibabaSans-Heavy.woff2',
  },
] as const;

const alibabaSansFontFaceStyle = alibabaSansFonts
  .map(
    ({ weight, url }) => `
@font-face {
  font-family: 'AlibabaSans';
  font-style: normal;
  font-weight: ${weight};
  font-display: optional;
  src: url('${url}') format('woff2');
}`,
  )
  .join('\n');

const staleBundleRecoveryScript = `
(() => {
  const reloadKey = 'phoenix-mini-llm:stale-bundle:' + ${JSON.stringify(buildHash)};
  const reloadQueryKey = '__phoenix_reload';
  const staleBundlePattern =
    /Callout is not defined|ChunkLoadError|Loading (CSS )?chunk [^ ]+ failed/i;

  const cleanupReloadQuery = () => {
    const url = new URL(window.location.href);

    if (!url.searchParams.has(reloadQueryKey)) {
      return;
    }

    url.searchParams.delete(reloadQueryKey);
    window.history.replaceState(window.history.state, '', url.toString());
  };

  const buildReloadUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set(
      reloadQueryKey,
      ${JSON.stringify(buildHash)} + '-' + Date.now().toString(36),
    );
    return url.toString();
  };

  const reloadOnce = () => {
    try {
      if (sessionStorage.getItem(reloadKey)) {
        return;
      }

      sessionStorage.setItem(reloadKey, '1');
    } catch (error) {
      // Ignore storage availability issues and still attempt a reload.
    }

    window.location.replace(buildReloadUrl());
  };

  const getMessage = (value) => {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value.message === 'string') {
      return value.message;
    }

    if (value.error) {
      return getMessage(value.error);
    }

    if (value.reason) {
      return getMessage(value.reason);
    }

    return '';
  };

  window.addEventListener(
    'error',
    (event) => {
      if (staleBundlePattern.test(getMessage(event))) {
        reloadOnce();
      }
    },
    true,
  );

  window.addEventListener('unhandledrejection', (event) => {
    if (staleBundlePattern.test(getMessage(event))) {
      reloadOnce();
    }
  });

  window.addEventListener('load', cleanupReloadQuery, { once: true });
})();
`;

const learningChapters = [
  { title: '学习主线总览', link: '/learning' },
  { title: '01. 你到底在做什么', link: '/learning/01-what-you-are-building' },
  { title: '02. Python 环境与 uv', link: '/learning/02-python-environment-and-uv' },
  { title: '03. Tensor 与线性代数直觉', link: '/learning/03-tensors-and-linear-algebra' },
  { title: '04. 自动求导与训练闭环', link: '/learning/04-autograd-and-training-loop' },
  { title: '05. 从文本到 Token', link: '/learning/05-text-to-tokens' },
  {
    title: '06. 语言模型训练目标',
    link: '/learning/06-language-modeling-objective',
  },
  { title: '07. 从 MLP 到 Attention', link: '/learning/07-from-mlp-to-attention' },
  { title: '08. Transformer Block', link: '/learning/08-transformer-blocks' },
  { title: '09. 把模型拼起来', link: '/learning/09-assembling-the-model' },
  { title: '10. 训练工程', link: '/learning/10-training-engineering' },
  { title: '11. 推理与采样', link: '/learning/11-inference-and-sampling' },
  { title: '12. 调试与评估', link: '/learning/12-debugging-and-evaluation' },
];

const tutorialStages = [
  { title: '复刻总览', link: '/tutorials' },
  { title: '01. 建立项目骨架', link: '/tutorials/01-bootstrap-the-project' },
  { title: '02. 准备语料与数据管线', link: '/tutorials/02-prepare-the-corpus' },
  { title: '03. 训练 Tokenizer', link: '/tutorials/03-train-the-tokenizer' },
  { title: '04. 写最小训练闭环', link: '/tutorials/04-build-a-tiny-training-loop' },
  {
    title: '05. 实现 Attention 与 Block',
    link: '/tutorials/05-implement-attention-and-blocks',
  },
  { title: '06. 拼出主模型', link: '/tutorials/06-assemble-the-model' },
  {
    title: '07. 训练器与 Checkpoint',
    link: '/tutorials/07-build-training-and-checkpointing',
  },
  { title: '08. 生成与采样', link: '/tutorials/08-build-generation-and-sampling' },
  { title: '09. 工程化补全', link: '/tutorials/09-polish-tests-and-commands' },
  { title: '10. 跑出基线结果', link: '/tutorials/10-reproduce-the-baseline' },
];

const pitfalls = [
  { title: '踩坑记录总览', link: '/pitfalls' },
  { title: '01. uv 在 PATH 中缺失', link: '/pitfalls/01-uv-path-and-project-python' },
  { title: '02. .gitignore 误伤 data 包', link: '/pitfalls/02-gitignore-and-package-names' },
  { title: '03. 流式数据集与子集规模', link: '/pitfalls/03-streaming-datasets-and-prep-scale' },
  { title: '04. Tokenizer 元数据同步', link: '/pitfalls/04-tokenizer-metadata-sync' },
  { title: '05. MPS 与 CUDA 的精度差异', link: '/pitfalls/05-mps-vs-cuda-and-amp' },
  { title: '06. 过度覆写 dumi 默认布局', link: '/pitfalls/06-overriding-dumi-default-layout' },
  {
    title: '07. GitHub Pages 子路径构建',
    link: '/pitfalls/07-github-pages-subpath-and-base-config',
  },
];

const docsRoutePaths = Array.from(
  new Set([
    '/',
    projectOverviewPath,
    ...learningChapters.map((item) => item.link),
    ...tutorialStages.map((item) => item.link),
    ...pitfalls.map((item) => item.link),
  ]),
);

export default defineConfig({
  hash: true,
  base: docsBase,
  publicPath: docsBase,
  styles: [alibabaSansFontFaceStyle],
  links: [
    {
      rel: 'icon',
      href: `${docsBase}favicon.svg`,
      type: 'image/svg+xml',
    },
    ...alibabaSansFonts.map(({ url }) => ({
      rel: 'preload',
      as: 'font',
      href: url,
      type: 'font/woff2',
      crossorigin: 'anonymous',
    })),
  ],
  favicons: [`${docsBase}favicon.svg`],
  metas: [
    { name: 'build-time', content: buildTime },
    { name: 'build-hash', content: buildHash },
  ],
  headScripts: [staleBundleRecoveryScript],
  conventionRoutes: {
    exclude: [/index\/components\//],
  },
  exportStatic: {
    extraRoutePaths: docsRoutePaths,
  },
  resolve: {
    docDirs: ['docs'],
    forceKebabCaseRouting: true,
  },
  themeConfig: {
    name: 'Phoenix Mini LLM',
    docsBase,
    footer: 'Phoenix Mini LLM Documentation',
    prefersColor: { default: 'light', switch: false },
    socialLinks: {
      github: `https://github.com/${githubRepo}`,
    },
    nav: [
      { title: '首页', link: '/' },
      { title: '学习主线', link: '/learning' },
      { title: '复刻教程', link: '/tutorials' },
      { title: '踩坑记录', link: '/pitfalls' },
      { title: '项目总览', link: projectOverviewPath },
      { title: '项目源码', link: `https://github.com/${githubRepo}` },
    ],
    sidebar: {
      '/learning': [
        {
          title: '按顺序学习',
          children: learningChapters,
        },
      ],
      '/tutorials': [
        {
          title: '按阶段复刻',
          children: tutorialStages,
        },
      ],
      '/pitfalls': [
        {
          title: '按时间线回顾',
          children: pitfalls,
        },
      ],
    },
    editLink: true,
    lastUpdated: true,
    showLineNum: true,
  },
});
