import { defineConfig } from 'dumi';

export default defineConfig({
  resolve: {
    docDirs: ['docs'],
    forceKebabCaseRouting: true,
  },
  themeConfig: {
    name: 'Phoenix Mini LLM',
    footer: 'Phoenix Mini LLM Docs',
    prefersColor: { default: 'light', switch: false },
    socialLinks: {
      github: 'https://github.com/umijs/dumi',
    },
    nav: [
      { title: '首页', link: '/' },
      { title: '知识档案', link: '/knowledge' },
      { title: '踩坑记录', link: '/pitfalls' },
      { title: '复刻教程', link: '/tutorials' },
    ],
    sidebar: {
      '/knowledge': [
        {
          title: '阅读顺序',
          children: [
            { title: '知识档案总览', link: '/knowledge' },
            { title: '1. Python、uv 与工程习惯', link: '/knowledge/python-and-uv' },
            { title: '2. Tensor 与自动求导', link: '/knowledge/tensors-and-autograd' },
            { title: '3. 文本数据与 Tokenizer', link: '/knowledge/data-and-tokenization' },
            { title: '4. Transformer 基础', link: '/knowledge/transformer-basics' },
            { title: '5. 本项目模型设计', link: '/knowledge/modeling-phoenix-mini-llm' },
            { title: '6. 训练与优化', link: '/knowledge/training-and-optimization' },
            { title: '7. 推理与采样', link: '/knowledge/inference-and-sampling' },
            { title: '8. 跨平台工程实践', link: '/knowledge/cross-platform-engineering' },
            { title: '9. 评估、排错与下一步', link: '/knowledge/evaluation-and-debugging' },
          ],
        },
      ],
      '/pitfalls': [
        {
          title: '按时间顺序',
          children: [
            { title: '踩坑记录总览', link: '/pitfalls' },
            { title: '1. uv 在 PATH 中缺失', link: '/pitfalls/01-uv-path-and-project-python' },
            { title: '2. .gitignore 误伤 data 包', link: '/pitfalls/02-gitignore-and-package-names' },
            { title: '3. 流式数据集与子集规模', link: '/pitfalls/03-streaming-datasets-and-prep-scale' },
            { title: '4. Tokenizer 元数据同步', link: '/pitfalls/04-tokenizer-metadata-sync' },
            { title: '5. MPS 与 CUDA 的精度差异', link: '/pitfalls/05-mps-vs-cuda-and-amp' },
          ],
        },
      ],
      '/tutorials': [
        {
          title: '复刻',
          children: [
            { title: '教程总览', link: '/tutorials' },
            { title: '完整复刻 phoenix-mini-llm', link: '/tutorials/reproduce-phoenix-mini-llm' },
          ],
        },
      ],
    },
    lastUpdated: true,
    showLineNum: true,
  },
});
