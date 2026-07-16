export type LearningLink = {
  title: string;
  link: string;
  description?: string;
};

export type LearningPart = {
  title: string;
  link: string;
  summary: string;
  chapters: LearningLink[];
};

export const legacyLearningChapters: LearningLink[] = [
  { title: '01. 你到底在做什么', link: '/learning/01-what-you-are-building' },
  { title: '02. Python 环境与 uv', link: '/learning/02-python-environment-and-uv' },
  { title: '03. Tensor 与线性代数直觉', link: '/learning/03-tensors-and-linear-algebra' },
  { title: '04. 自动求导与训练闭环', link: '/learning/04-autograd-and-training-loop' },
  { title: '05. 从文本到 Token', link: '/learning/05-text-to-tokens' },
  { title: '06. 语言模型训练目标', link: '/learning/06-language-modeling-objective' },
  { title: '07. 从 MLP 到 Attention', link: '/learning/07-from-mlp-to-attention' },
  { title: '08. Transformer Block', link: '/learning/08-transformer-blocks' },
  { title: '09. 把模型拼起来', link: '/learning/09-assembling-the-model' },
  { title: '10. 训练工程', link: '/learning/10-training-engineering' },
  { title: '11. 推理与采样', link: '/learning/11-inference-and-sampling' },
  { title: '12. 调试与评估', link: '/learning/12-debugging-and-evaluation' },
];

export const learningBookParts: LearningPart[] = [
  {
    title: 'Part 1. 入门与学习地图',
    link: '/learning/part-1-orientation',
    summary:
      '先建立正确目标、基本术语和学习顺序，明确语言模型到底是什么，为什么应该从小模型学到大模型。',
    chapters: [
      {
        title: '01. 什么是语言模型',
        link: '/learning/part-1-orientation/01-what-is-a-language-model',
      },
      {
        title: '02. 为什么应该先做一个小模型',
        link: '/learning/part-1-orientation/02-why-start-with-a-small-model',
      },
      {
        title: '03. 怎样使用这套知识档案',
        link: '/learning/part-1-orientation/03-how-to-use-this-book',
      },
    ],
  },
  {
    title: 'Part 2. 数学与神经网络基础',
    link: '/learning/part-2-neural-network-foundations',
    summary:
      '从机器学习、向量空间、线性层、激活函数、概率与损失函数开始，补齐理解语言模型所必需的神经网络地基。',
    chapters: [
      {
        title: '01. 机器学习到底在学什么',
        link: '/learning/part-2-neural-network-foundations/01-what-does-it-mean-to-learn',
      },
      {
        title: '02. 向量、矩阵、张量与 shape',
        link: '/learning/part-2-neural-network-foundations/02-vectors-matrices-and-tensors',
      },
      {
        title: '03. 线性层、激活函数与表示空间',
        link: '/learning/part-2-neural-network-foundations/03-linear-layers-activations-and-representations',
      },
      {
        title: '04. 概率、softmax 与交叉熵',
        link: '/learning/part-2-neural-network-foundations/04-probability-softmax-and-cross-entropy',
      },
      {
        title: '05. 梯度、反向传播与优化',
        link: '/learning/part-2-neural-network-foundations/05-gradients-backpropagation-and-optimization',
      },
      {
        title: '06. 过拟合、泛化与验证集',
        link: '/learning/part-2-neural-network-foundations/06-overfitting-generalization-and-validation',
      },
    ],
  },
  {
    title: 'Part 3. 文本为什么能变成训练数据',
    link: '/learning/part-3-text-as-data',
    summary:
      '把自然语言视为数据对象，系统理解语料、编码、分词、词表、样本打包与 next-token prediction。',
    chapters: [
      {
        title: '01. 语料、样本与数据分布',
        link: '/learning/part-3-text-as-data/01-corpora-samples-and-data-distribution',
      },
      {
        title: '02. Unicode、字节与文本规范化',
        link: '/learning/part-3-text-as-data/02-unicode-bytes-and-text-normalization',
      },
      {
        title: '03. Token、词表与 special token',
        link: '/learning/part-3-text-as-data/03-tokens-vocabularies-and-special-tokens',
      },
    ],
  },
  {
    title: 'Part 4. Transformer 与语言模型主体',
    link: '/learning/part-4-transformers-and-language-models',
    summary:
      '从早期序列建模困境切入，讲清 attention、causal mask、位置方法、Transformer block 与 decoder-only 架构。',
    chapters: [],
  },
  {
    title: 'Part 5. 训练一个小型语言模型',
    link: '/learning/part-5-training-a-small-language-model',
    summary:
      '解释训练循环、优化器、学习率、batch、稳定性技巧、显存约束与实验管理，让模型真的学起来。',
    chapters: [],
  },
  {
    title: 'Part 6. 推理、评估与调试',
    link: '/learning/part-6-inference-evaluation-and-debugging',
    summary:
      '理解自回归生成、采样策略、KV cache、困惑度、定性评估、链路验证和常见故障定位方法。',
    chapters: [],
  },
  {
    title: 'Part 7. 从小模型走向更大模型',
    link: '/learning/part-7-where-to-go-next',
    summary:
      '把你亲手做出的基础模型放回更大的版图中，理解预训练、微调、对齐、量化、LoRA 与后续学习路径。',
    chapters: [],
  },
];

const uniqueLinks = (links: string[]) => Array.from(new Set(links));

export const learningBookOverviewLinks: LearningLink[] = learningBookParts.map((part) => ({
  title: part.title,
  link: part.link,
  description: part.summary,
}));

export const learningPrimaryPaths = uniqueLinks([
  '/learning',
  ...learningBookParts.flatMap((part) => [part.link, ...part.chapters.map((chapter) => chapter.link)]),
]);

export const learningAllPaths = uniqueLinks([
  ...learningPrimaryPaths,
  ...legacyLearningChapters.map((chapter) => chapter.link),
]);

export const learningSidebarGroups = [
  {
    title: '总览',
    children: [{ title: '学习主线总览', link: '/learning' }],
  },
  ...learningBookParts.map((part) => ({
    title: part.title,
    children: [
      { title: '分册总览', link: part.link },
      ...part.chapters,
    ],
  })),
];
