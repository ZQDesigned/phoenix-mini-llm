export type LearningLink = {
  title: string;
  link: string;
  description?: string;
};

export type LearningSection = {
  title: string;
  link: string;
  summary: string;
  chapters: LearningLink[];
};

export type LearningDivision = {
  title: string;
  summary: string;
  sections: LearningSection[];
};

export const learningQuickReadAppendix: LearningLink[] = [
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

export const learningBookDivisions: LearningDivision[] = [
  {
    title: '序篇. 学习方法、问题意识与全书地图',
    summary:
      '先解决“这套知识到底是什么、为什么不能按项目脚本顺序来学、零基础读者应当怎样阅读”这三个最容易被跳过的问题。',
    sections: [
      {
        title: '卷一. 入门与学习地图',
        link: '/learning/part-1-orientation',
        summary:
          '回答你到底在学什么、为什么初学者应该从小而完整的模型起步，以及怎样把整套材料当作一本书顺序读下去。',
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
    ],
  },
  {
    title: '第一编. 数学与数值世界',
    summary:
      '先把模型内部共同使用的语言建立起来，从数值对象、线性代数、函数、概率、信息到导数，为后面的神经网络和语言模型章节打统一地基。',
    sections: [
      {
        title: '卷二. 数学对象、线性代数与表示空间',
        link: '/learning/part-2-mathematical-prerequisites',
        summary:
          '从标量、向量、矩阵、张量、线性变换与几何直觉开始，建立模型内部一切计算共享的对象世界。',
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
            title: '04. 长度、点积、相似度与几何直觉',
            link: '/learning/part-2-mathematical-prerequisites/04-length-dot-products-similarity-and-geometric-intuition',
          },
        ],
      },
      {
        title: '卷三. 函数、概率、信息与导数',
        link: '/learning/part-3-functions-calculus-probability-and-information',
        summary:
          '把非线性、概率分布、对数概率、信息量与局部变化率接成一条线，搭桥到损失、梯度与训练。',
        chapters: [
          {
            title: '01. 函数、复合与非线性为什么重要',
            link: '/learning/part-2-mathematical-prerequisites/05-functions-composition-and-why-nonlinearity-matters',
          },
          {
            title: '02. 概率分布、期望与不确定性',
            link: '/learning/part-2-mathematical-prerequisites/06-probability-distributions-expectation-and-uncertainty',
          },
          {
            title: '03. 对数、信息量与为什么损失常写成对数概率',
            link: '/learning/part-2-mathematical-prerequisites/07-logarithms-information-and-why-loss-uses-log-probability',
          },
          {
            title: '04. 导数、偏导数与局部变化率',
            link: '/learning/part-3-machine-learning-and-neural-networks/03-derivatives-partial-derivatives-and-local-change',
          },
        ],
      },
    ],
  },
  {
    title: '第二编. 机器学习与神经网络',
    summary:
      '回答模型到底在学什么、神经网络怎样形成表示、损失与梯度怎样闭合训练，以及为什么泛化永远不能被忽略。',
    sections: [
      {
        title: '卷四. 从数据到学习问题',
        link: '/learning/part-4-learning-from-data',
        summary:
          '讲清原始数据、训练样本、特征、标签、目标和张量布局之间的关系，让“模型到底在学什么”先稳定下来。',
        chapters: [
          {
            title: '01. 机器学习到底在学什么',
            link: '/learning/part-3-machine-learning-and-neural-networks/01-what-does-it-mean-to-learn',
          },
          {
            title: '02. 样本、特征、标签、batch 与张量布局',
            link: '/learning/part-3-machine-learning-and-neural-networks/02-vectors-matrices-and-tensors',
          },
          {
            title: '03. 从线性模型到第一个神经网络',
            link: '/learning/part-3-machine-learning-and-neural-networks/04-from-linear-models-to-the-first-neural-network',
          },
        ],
      },
      {
        title: '卷五. 神经网络作为表示学习系统',
        link: '/learning/part-5-neural-networks-and-optimization',
        summary:
          '先讲清隐藏表示、非线性、logits、softmax 与交叉熵，让读者真正理解神经网络为何不仅是层叠算子，而是一台表示改写机器。',
        chapters: [
          {
            title: '01. 线性层、激活函数与表示空间',
            link: '/learning/part-3-machine-learning-and-neural-networks/05-linear-layers-activations-and-representations',
          },
          {
            title: '02. 概率、softmax 与交叉熵',
            link: '/learning/part-3-machine-learning-and-neural-networks/06-probability-softmax-and-cross-entropy',
          },
        ],
      },
      {
        title: '卷六. 优化、噪声与泛化',
        link: '/learning/part-6-optimization-and-generalization',
        summary:
          '再把梯度、反向传播、小批量噪声、过拟合、验证集与泛化接回同一条训练主线，解释模型为什么会学、又为什么会学歪。',
        chapters: [
          {
            title: '01. 梯度、链式法则、反向传播与优化',
            link: '/learning/part-3-machine-learning-and-neural-networks/07-gradients-backpropagation-and-optimization',
          },
          {
            title: '02. 小批量梯度下降、噪声与训练的统计本性',
            link: '/learning/part-3-machine-learning-and-neural-networks/08-mini-batch-gradient-descent-noise-and-why-training-is-statistical',
          },
          {
            title: '03. 过拟合、泛化与验证集',
            link: '/learning/part-3-machine-learning-and-neural-networks/09-overfitting-generalization-and-validation',
          },
        ],
      },
    ],
  },
  {
    title: '第三编. 文本、分词与语言建模',
    summary:
      '先把自然语言改写成机器可操作的离散对象，再解释为什么语言模型会自然落成序列条件概率问题，而不是只会背“右移一位”的模板。',
    sections: [
      {
        title: '卷七. 文本怎样进入模型：语料、编码与分词',
        link: '/learning/part-4-text-and-tokenization',
        summary:
          '处理语料、编码、分词与词表，让读者先看清文本如何从自然语言对象被改写成机器可操作的离散单位。',
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
        ],
      },
      {
        title: '卷八. 语言建模为什么本质上是序列条件概率问题',
        link: '/learning/part-8-language-modeling-as-sequence-prediction',
        summary:
          '把序列困难、样本窗口和 next-token 目标接成一条线，说明语言模型为什么天然会走向“给定历史预测下一个 token”。',
        chapters: [
          {
            title: '01. 为什么序列数据比普通表格数据更难',
            link: '/learning/part-3-machine-learning-and-neural-networks/10-why-sequence-data-is-harder-than-tabular-data',
          },
          {
            title: '02. 从 token 流到固定长度训练样本',
            link: '/learning/part-4-text-and-tokenization/05-from-token-streams-to-fixed-length-training-samples',
          },
          {
            title: '03. 为什么训练目标表现成右移一位',
            link: '/learning/part-4-text-and-tokenization/06-why-the-objective-looks-like-a-one-token-shift',
          },
        ],
      },
    ],
  },
  {
    title: '第四编. 序列建模、注意力与 Transformer',
    summary:
      '先解释早期序列方法为什么会卡住，再把 attention、QKV、mask、位置方法与 decoder-only Transformer 重新放回问题驱动的叙事里。',
    sections: [
      {
        title: '卷九. 从记忆瓶颈到 Attention 的问题框架',
        link: '/learning/part-7-sequence-modeling-foundations',
        summary:
          '先讲清早期序列结构为什么会在长依赖上吃亏，再讲 attention 作为内容驱动读取机制是如何被问题逼出来的。',
        chapters: [
          {
            title: '01. 为什么早期序列建模会遇到瓶颈',
            link: '/learning/part-5-sequence-modeling-and-transformers/01-why-earlier-sequence-models-hit-limits',
          },
          {
            title: '02. Attention 真正要解决什么问题',
            link: '/learning/part-5-sequence-modeling-and-transformers/02-what-problem-attention-actually-solves',
          },
        ],
      },
      {
        title: '卷十. 从 Attention 到完整的 Decoder-only Transformer',
        link: '/learning/part-5-sequence-modeling-and-transformers',
        summary:
          '进入现代语言模型主体，讲清 QKV、causal mask、位置方法、Transformer block 与完整 decoder-only 模型装配。',
        chapters: [
          {
            title: '01. Query、Key、Value 与加权读取',
            link: '/learning/part-5-sequence-modeling-and-transformers/03-query-key-value-and-weighted-reading',
          },
          {
            title: '02. 因果注意力与 mask',
            link: '/learning/part-5-sequence-modeling-and-transformers/04-causal-attention-and-masking',
          },
          {
            title: '03. 位置方法到底在补什么',
            link: '/learning/part-5-sequence-modeling-and-transformers/05-what-positional-methods-actually-add',
          },
          {
            title: '04. Transformer block 为什么能反复堆叠',
            link: '/learning/part-5-sequence-modeling-and-transformers/06-why-transformer-blocks-stack-so-well',
          },
          {
            title: '05. 一个完整 decoder-only 模型怎样组装',
            link: '/learning/part-5-sequence-modeling-and-transformers/07-how-a-complete-decoder-only-model-is-assembled',
          },
        ],
      },
    ],
  },
  {
    title: '第五编. 训练、推理、评估与调试',
    summary:
      '把模型放到真实时间轴上，处理训练统计、小显存约束、采样行为、评估信号与系统化排障，让“能生成”与“能解释”统一起来。',
    sections: [
      {
        title: '卷十一. 训练一个小型语言模型',
        link: '/learning/part-6-training-a-small-language-model',
        summary:
          '展开训练过程中的 batch、优化器、学习率、显存约束、稳定性技巧与 checkpoint 体系。',
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
        title: '卷十二. 推理、评估与调试',
        link: '/learning/part-7-inference-evaluation-and-debugging',
        summary:
          '把生成时的 logits、采样、停止条件、KV cache、困惑度、定性样例与最小化排错流程接回同一条运行链。',
        chapters: [
          {
            title: '01. 自回归生成、prefill 与 decode',
            link: '/learning/part-7-inference-evaluation-and-debugging/01-autoregressive-generation-prefill-and-decode',
          },
          {
            title: '02. 从 logits 到下一个 token',
            link: '/learning/part-7-inference-evaluation-and-debugging/02-from-logits-to-the-next-token',
          },
          {
            title: '03. greedy、temperature、top-k 与 top-p 各在控制什么',
            link: '/learning/part-7-inference-evaluation-and-debugging/03-what-greedy-temperature-top-k-and-top-p-actually-control',
          },
          {
            title: '04. EOS、停止条件与重复问题',
            link: '/learning/part-7-inference-evaluation-and-debugging/04-eos-stopping-criteria-and-repetition',
          },
          {
            title: '05. KV cache 到底缓存了什么',
            link: '/learning/part-7-inference-evaluation-and-debugging/05-what-kv-cache-is-actually-saving',
          },
          {
            title: '06. 为什么训练 loss 与生成质量不总同步',
            link: '/learning/part-7-inference-evaluation-and-debugging/06-why-training-loss-and-generation-quality-do-not-always-move-together',
          },
          {
            title: '07. 困惑度、验证集与定性样例怎样一起评估',
            link: '/learning/part-7-inference-evaluation-and-debugging/07-how-to-use-perplexity-validation-and-qualitative-samples-together',
          },
          {
            title: '08. 极小样本过拟合与系统化排错',
            link: '/learning/part-7-inference-evaluation-and-debugging/08-overfit-a-tiny-batch-and-debug-the-whole-pipeline',
          },
        ],
      },
    ],
  },
  {
    title: '第六编. 迁移、扩展与更大的模型世界',
    summary:
      '当读者已经能理解并实现一个小模型后，再把它放回更大的预训练、适配、压缩、部署与研究语境中。',
    sections: [
      {
        title: '卷十三. 从小模型走向更大的模型世界',
        link: '/learning/part-8-where-to-go-next',
        summary:
          '连接预训练、微调、LoRA、量化、部署和后续学习路径，让小模型经验真正具备迁移性。',
        chapters: [
          {
            title: '01. 预训练、微调与任务适配',
            link: '/learning/part-8-where-to-go-next/01-pretraining-finetuning-and-task-adaptation',
          },
        ],
      },
    ],
  },
];

export const learningSupplementalPaths = [
  '/learning/part-3-machine-learning-and-neural-networks',
];

const uniqueLinks = (links: string[]) => Array.from(new Set(links));

export const learningBookSections: LearningSection[] = learningBookDivisions.flatMap(
  (division) => division.sections,
);

export const learningBookOverviewLinks: LearningLink[] = learningBookSections.map((section) => ({
  title: section.title,
  link: section.link,
  description: section.summary,
}));

export const learningPrimaryPaths = uniqueLinks([
  '/learning',
  ...learningBookSections.flatMap((section) => [
    section.link,
    ...section.chapters.map((chapter) => chapter.link),
  ]),
]);

export const learningAllPaths = uniqueLinks([
  ...learningPrimaryPaths,
  ...learningQuickReadAppendix.map((chapter) => chapter.link),
  ...learningSupplementalPaths,
]);

export const learningSidebarGroups = [
  {
    title: '总序',
    children: [{ title: '学习知识档案总序', link: '/learning' }],
  },
  ...learningBookDivisions.map((division) => ({
    title: division.title,
    children: division.sections.flatMap((section) => [
      { title: section.title, link: section.link },
      ...section.chapters,
    ]),
  })),
  {
    title: '附录 A. 项目速读与回看路径（非正文）',
    children: learningQuickReadAppendix,
  },
  {
    title: '附录 B. 中段总览',
    children: [
      {
        title: '机器学习篇总览：卷四到卷六',
        link: '/learning/part-3-machine-learning-and-neural-networks',
      },
    ],
  },
];
