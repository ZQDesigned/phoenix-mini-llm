import { defineConfig } from 'dumi';

const docsBase = process.env.DOCS_SITE_BASE || '/';
const githubRepo = process.env.GITHUB_REPOSITORY || 'ZQDesigned/phoenix-mini-llm';

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
    ...learningChapters.map((item) => item.link),
    ...tutorialStages.map((item) => item.link),
    ...pitfalls.map((item) => item.link),
  ]),
);

export default defineConfig({
  base: docsBase,
  publicPath: docsBase,
  exportStatic: {
    extraRoutePaths: docsRoutePaths,
  },
  resolve: {
    docDirs: ['docs'],
    forceKebabCaseRouting: true,
  },
  themeConfig: {
    name: 'Phoenix Mini LLM',
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
