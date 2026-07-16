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
      '先建立目标、术语和阅读方法，理解语言模型是什么，为什么应该先做小而完整的模型，再进入真正的基础知识。',
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
    title: 'Part 2. 数学预备、表示与概率直觉',
    link: '/learning/part-2-mathematical-prerequisites',
    summary:
      '在进入神经网络之前，先补齐数值表示、维度、矩阵运算、函数复合、概率分布与信息量这些真正决定理解质量的前置地基。',
    chapters: [
      {
        title: '01. 为什么学语言模型还要先学数学',
        link: '/learning/part-2-mathematical-prerequisites/01-why-you-still-need-math-for-language-models',
      },
      {
        title: '02. 标量、向量、矩阵、张量与 shape',
        link: '/learning/part-2-mathematical-prerequisites/02-scalars-vectors-matrices-tensors-and-shapes',
      },
      {
        title: '03. 矩阵乘法、线性变换与维度流动',
        link: '/learning/part-2-mathematical-prerequisites/03-matrix-multiplication-linear-transformations-and-dimensional-flow',
      },
      {
        title: '04. 函数、复合与非线性为什么重要',
        link: '/learning/part-2-mathematical-prerequisites/04-functions-composition-and-why-nonlinearity-matters',
      },
      {
        title: '05. 概率分布、期望与不确定性',
        link: '/learning/part-2-mathematical-prerequisites/05-probability-distributions-expectation-and-uncertainty',
      },
      {
        title: '06. 对数、信息量与为什么损失常写成对数概率',
        link: '/learning/part-2-mathematical-prerequisites/06-logarithms-information-and-why-loss-uses-log-probability',
      },
    ],
  },
  {
    title: 'Part 3. 机器学习、张量与神经网络基础',
    link: '/learning/part-3-machine-learning-and-neural-networks',
    summary:
      '从“学习到底在学什么”出发，讲清线性层、表示空间、softmax、交叉熵、梯度、优化和泛化，完成进入 LLM 之前的神经网络主地基。',
    chapters: [
      {
        title: '01. 机器学习到底在学什么',
        link: '/learning/part-3-machine-learning-and-neural-networks/01-what-does-it-mean-to-learn',
      },
      {
        title: '02. 向量、矩阵、张量与 shape',
        link: '/learning/part-3-machine-learning-and-neural-networks/02-vectors-matrices-and-tensors',
      },
      {
        title: '03. 线性层、激活函数与表示空间',
        link: '/learning/part-3-machine-learning-and-neural-networks/03-linear-layers-activations-and-representations',
      },
      {
        title: '04. 概率、softmax 与交叉熵',
        link: '/learning/part-3-machine-learning-and-neural-networks/04-probability-softmax-and-cross-entropy',
      },
      {
        title: '05. 梯度、反向传播与优化',
        link: '/learning/part-3-machine-learning-and-neural-networks/05-gradients-backpropagation-and-optimization',
      },
      {
        title: '06. 过拟合、泛化与验证集',
        link: '/learning/part-3-machine-learning-and-neural-networks/06-overfitting-generalization-and-validation',
      },
      {
        title: '07. 为什么序列数据比普通表格数据更难',
        link: '/learning/part-3-machine-learning-and-neural-networks/07-why-sequence-data-is-harder-than-tabular-data',
      },
    ],
  },
  {
    title: 'Part 4. 文本、编码与 Tokenizer',
    link: '/learning/part-4-text-and-tokenization',
    summary:
      '把自然语言重新看作可训练数据，系统解释语料、编码、规范化、tokenizer、词表、样本打包与 next-token 监督是怎样接上的。',
    chapters: [
      {
        title: '01. 语料、样本与数据分布',
        link: '/learning/part-4-text-and-tokenization/01-corpora-samples-and-data-distribution',
      },
      {
        title: '02. Unicode、字节与文本规范化',
        link: '/learning/part-4-text-and-tokenization/02-unicode-bytes-and-text-normalization',
      },
      {
        title: '03. Token、词表与 special token',
        link: '/learning/part-4-text-and-tokenization/03-tokens-vocabularies-and-special-tokens',
      },
      {
        title: '04. 子词分词、BPE 与 tokenizer 训练',
        link: '/learning/part-4-text-and-tokenization/04-subword-tokenization-bpe-and-tokenizer-training',
      },
      {
        title: '05. 从 token 流到固定长度训练样本',
        link: '/learning/part-4-text-and-tokenization/05-from-token-streams-to-fixed-length-training-samples',
      },
      {
        title: '06. 为什么训练目标表现成右移一位',
        link: '/learning/part-4-text-and-tokenization/06-why-the-objective-looks-like-a-one-token-shift',
      },
    ],
  },
  {
    title: 'Part 5. 序列建模、Attention 与 Transformer',
    link: '/learning/part-5-sequence-modeling-and-transformers',
    summary:
      '从序列建模为什么困难讲到 attention 解决了什么，再进入 causal mask、位置方法、Transformer block 与完整 decoder-only 主体。',
    chapters: [
      {
        title: '01. 为什么早期序列建模会遇到瓶颈',
        link: '/learning/part-5-sequence-modeling-and-transformers/01-why-earlier-sequence-models-hit-limits',
      },
      {
        title: '02. Attention 真正要解决什么问题',
        link: '/learning/part-5-sequence-modeling-and-transformers/02-what-problem-attention-actually-solves',
      },
      {
        title: '03. Query、Key、Value 与加权读取',
        link: '/learning/part-5-sequence-modeling-and-transformers/03-query-key-value-and-weighted-reading',
      },
      {
        title: '04. 因果注意力与 mask',
        link: '/learning/part-5-sequence-modeling-and-transformers/04-causal-attention-and-masking',
      },
      {
        title: '05. 位置方法到底在补什么',
        link: '/learning/part-5-sequence-modeling-and-transformers/05-what-positional-methods-actually-add',
      },
      {
        title: '06. Transformer block 为什么能反复堆叠',
        link: '/learning/part-5-sequence-modeling-and-transformers/06-why-transformer-blocks-stack-so-well',
      },
      {
        title: '07. 一个完整 decoder-only 模型怎样组装',
        link: '/learning/part-5-sequence-modeling-and-transformers/07-how-a-complete-decoder-only-model-is-assembled',
      },
    ],
  },
  {
    title: 'Part 6. 训练一个小型语言模型',
    link: '/learning/part-6-training-a-small-language-model',
    summary:
      '把训练过程重新展开成可解释系统，覆盖 batch、tokens、steps、优化器、学习率、显存约束、稳定性技巧与实验管理。',
    chapters: [
      {
        title: '01. batch、token、step 与 epoch 到底在统计什么',
        link: '/learning/part-6-training-a-small-language-model/01-what-batches-tokens-steps-and-epochs-really-count',
      },
      {
        title: '02. 优化器到底在改什么',
        link: '/learning/part-6-training-a-small-language-model/02-what-the-optimizer-is-actually-changing',
      },
      {
        title: '03. 学习率、warmup 与为什么训练会在早期崩掉',
        link: '/learning/part-6-training-a-small-language-model/03-learning-rate-warmup-and-why-early-training-breaks',
      },
      {
        title: '04. 小显存下为什么要做梯度累积',
        link: '/learning/part-6-training-a-small-language-model/04-why-gradient-accumulation-matters-under-small-vram',
      },
      {
        title: '05. 混合精度、GradScaler 与设备差异',
        link: '/learning/part-6-training-a-small-language-model/05-mixed-precision-gradscaler-and-device-differences',
      },
      {
        title: '06. 梯度裁剪、NaN 与不稳定更新',
        link: '/learning/part-6-training-a-small-language-model/06-gradient-clipping-nan-and-unstable-updates',
      },
      {
        title: '07. checkpoint、验证集与实验记录',
        link: '/learning/part-6-training-a-small-language-model/07-checkpoints-validation-and-experiment-records',
      },
    ],
  },
  {
    title: 'Part 7. 推理、评估与调试',
    link: '/learning/part-7-inference-evaluation-and-debugging',
    summary:
      '理解自回归生成、采样策略、KV cache、困惑度、定性评估与链路排障，让模型不只会训练，还能被可靠地使用和判断。',
    chapters: [],
  },
  {
    title: 'Part 8. 从小模型走向更大世界',
    link: '/learning/part-8-where-to-go-next',
    summary:
      '把小模型学习成果放回更大的版图中，理解预训练、微调、对齐、LoRA、量化、部署与后续学习方向之间的关系。',
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
    children: [{ title: '分册总览', link: part.link }, ...part.chapters],
  })),
];
