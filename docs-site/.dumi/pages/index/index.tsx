import React from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Helmet } from 'dumi';

import Link from '../../theme/common/Link';
import Group from './components/Group';

const learningChapters = [
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

const tutorialStages = [
  { title: '01. 建立项目骨架', link: '/tutorials/01-bootstrap-the-project' },
  { title: '02. 准备语料与数据管线', link: '/tutorials/02-prepare-the-corpus' },
  { title: '03. 训练 Tokenizer', link: '/tutorials/03-train-the-tokenizer' },
  { title: '04. 写最小训练闭环', link: '/tutorials/04-build-a-tiny-training-loop' },
  { title: '05. 实现 Attention 与 Block', link: '/tutorials/05-implement-attention-and-blocks' },
  { title: '06. 拼出主模型', link: '/tutorials/06-assemble-the-model' },
  { title: '07. 训练器与 Checkpoint', link: '/tutorials/07-build-training-and-checkpointing' },
  { title: '08. 生成与采样', link: '/tutorials/08-build-generation-and-sampling' },
  { title: '09. 工程化补全', link: '/tutorials/09-polish-tests-and-commands' },
  { title: '10. 跑出基线结果', link: '/tutorials/10-reproduce-the-baseline' },
];

const pitfalls = [
  { title: 'uv 在 PATH 中缺失', link: '/pitfalls/01-uv-path-and-project-python' },
  { title: '.gitignore 误伤 data 包', link: '/pitfalls/02-gitignore-and-package-names' },
  { title: '流式数据集与子集规模', link: '/pitfalls/03-streaming-datasets-and-prep-scale' },
  { title: 'Tokenizer 元数据同步', link: '/pitfalls/04-tokenizer-metadata-sync' },
  { title: 'MPS 与 CUDA 的精度差异', link: '/pitfalls/05-mps-vs-cuda-and-amp' },
  { title: '过度覆写 dumi 默认布局', link: '/pitfalls/06-overriding-dumi-default-layout' },
  { title: 'GitHub Pages 子路径构建', link: '/pitfalls/07-github-pages-subpath-and-base-config' },
];

const useStyle = createStyles(({ css, cssVar, token }) => ({
  banner: css`
    position: relative;
    min-height: 640px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(circle at 18% 22%, rgba(22, 119, 255, 0.16), transparent 28%),
      radial-gradient(circle at 82% 18%, rgba(114, 46, 209, 0.12), transparent 24%),
      linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  `,
  bannerInner: css`
    width: 100%;
    max-width: 1208px;
    padding: 120px ${cssVar.marginXXL}px 92px;
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.9fr);
    gap: ${cssVar.marginXXL}px;
    align-items: center;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
      padding-top: 96px;
    }
  `,
  bannerText: css`
    position: relative;
    z-index: 1;

    h1 {
      margin-bottom: ${cssVar.marginLG}px;
      font-weight: 900 !important;
      font-size: calc(${cssVar.fontSizeHeading1} * 1.9) !important;
      line-height: 1.05 !important;
      letter-spacing: -0.04em;
    }

    p {
      margin-bottom: ${cssVar.marginXL}px !important;
      color: ${cssVar.colorTextTertiary} !important;
      font-size: calc(${cssVar.fontSizeLG} * 1.22) !important;
      line-height: 1.9 !important;
    }
  `,
  bannerPanel: css`
    position: relative;
    z-index: 1;
    display: grid;
    gap: ${cssVar.marginLG}px;
  `,
  glassCard: css`
    border-radius: 24px !important;
    border: 1px solid rgba(22, 119, 255, 0.12) !important;
    background: rgba(255, 255, 255, 0.82) !important;
    box-shadow: 0 24px 80px rgba(10, 37, 64, 0.12) !important;
    backdrop-filter: blur(16px);
  `,
  sectionCard: css`
    height: 100%;
    border-radius: 20px !important;
    border: none !important;
    box-shadow: 0 20px 60px rgba(16, 24, 40, 0.08) !important;

    ${token.antCls}-card-body {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: ${cssVar.marginSM}px;
    }
  `,
  sectionLink: css`
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    gap: ${cssVar.marginXXS}px;
    color: ${cssVar.colorPrimary};
    font-weight: 600;
  `,
  denseGrid: css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${cssVar.marginLG}px;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
    }
  `,
  chapterCard: css`
    border-radius: 18px !important;
    border: 1px solid ${cssVar.colorBorderSecondary} !important;
    box-shadow: none !important;
    transition:
      transform ${cssVar.motionDurationMid},
      box-shadow ${cssVar.motionDurationMid},
      border-color ${cssVar.motionDurationMid};

    &:hover {
      transform: translateY(-4px);
      border-color: ${cssVar.colorPrimaryBorder};
      box-shadow: 0 18px 40px rgba(16, 24, 40, 0.08) !important;
    }
  `,
  listColumn: css`
    display: grid;
    gap: ${cssVar.marginSM}px;
  `,
  listItem: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${cssVar.margin}px;
    padding: ${cssVar.padding}px ${cssVar.paddingLG}px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.72);
    border: 1px solid rgba(22, 119, 255, 0.1);
  `,
}));

const Homepage: React.FC = () => {
  const { styles } = useStyle();

  return (
    <>
      <Helmet>
        <title>Phoenix Mini LLM</title>
        <meta
          name="description"
          content="面向初学者的大模型基础开发知识档案、完整复刻教程与真实踩坑记录。"
        />
      </Helmet>
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <div className={styles.bannerText}>
            <Space size="middle" wrap style={{ marginBottom: 24 }}>
              <Tag color="blue">6GB VRAM 约束</Tag>
              <Tag color="processing">Mac 开发 / Windows 训练</Tag>
              <Tag color="purple">从零实现 Decoder-only Transformer</Tag>
            </Space>
            <Typography.Title>让你真正把一个小型语言模型从空目录做出来</Typography.Title>
            <Typography.Paragraph>
              Phoenix Mini LLM 不是“运行一个现成仓库”的说明书，而是一套按顺序展开的学习工坊。
              你会先学清楚张量、损失函数、Tokenizer、Attention 与训练工程，再按教程一步一步写出和当前仓库一致的实现。
            </Typography.Paragraph>
            <Space size="middle" wrap>
              <Link to="/learning">
                <Button size="large" type="primary">
                  从零学习
                </Button>
              </Link>
              <Link to="/tutorials">
                <Button size="large">开始复刻</Button>
              </Link>
              <Link to="/pitfalls">
                <Button size="large" type="text">
                  查看踩坑记录
                </Button>
              </Link>
            </Space>
          </div>
          <div className={styles.bannerPanel}>
            <Card className={styles.glassCard}>
              <Space direction="vertical" size="middle">
                <Tag color="gold">项目边界</Tag>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  小而完整，而不是盲目追大
                </Typography.Title>
                <Typography.Paragraph style={{ margin: 0 }}>
                  目标是一个适合学习的 decoder-only 语言模型：语料准备、Tokenizer、模型、训练、采样与工程化链路都要完整，但规模必须服从 6GB 显存现实。
                </Typography.Paragraph>
              </Space>
            </Card>
            <Card className={styles.glassCard}>
              <Space direction="vertical" size="middle">
                <Tag color="cyan">阅读顺序</Tag>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  先懂原理，再照着复刻，再回看坑点
                </Typography.Title>
                <Typography.Paragraph style={{ margin: 0 }}>
                  如果你几乎从零开始，先走完学习主线；开始实作后再进入复刻教程；遇到异常时，再回踩坑记录对照排查。
                </Typography.Paragraph>
              </Space>
            </Card>
          </div>
        </div>
      </section>

      <Group
        id="learning"
        title="学习主线"
        description="12 章基础知识档案，覆盖从文本与 token 到训练工程与推理采样的完整前置知识。"
        background="#ffffff"
        collapse
      >
        <div className={styles.denseGrid}>
          {learningChapters.map((chapter) => (
            <Card key={chapter.link} className={styles.chapterCard}>
              <Typography.Title level={5}>{chapter.title}</Typography.Title>
              <Link to={chapter.link} className={styles.sectionLink}>
                进入章节
                <ArrowRightOutlined />
              </Link>
            </Card>
          ))}
        </div>
      </Group>

      <Group
        id="tutorials"
        title="复刻教程"
        description="10 个阶段按顺序构建 phoenix-mini-llm，每一章都对应实际文件、命令与验证点。"
        background="linear-gradient(180deg, #f7faff 0%, #eef4ff 100%)"
      >
        <Row gutter={[24, 24]}>
          {tutorialStages.map((stage) => (
            <Col xs={24} md={12} lg={8} key={stage.link}>
              <Card className={styles.sectionCard}>
                <Typography.Title level={5}>{stage.title}</Typography.Title>
                <Typography.Paragraph style={{ margin: 0 }}>
                  对应仓库中的真实实现阶段，而不是抽象演示项目。跟着这一条线走，最终做出的就是当前项目本身。
                </Typography.Paragraph>
                <Link to={stage.link} className={styles.sectionLink}>
                  打开阶段教程
                  <ArrowRightOutlined />
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </Group>

      <Group
        id="pitfalls"
        title="踩坑记录"
        description="按开发顺序保留环境、路径、数据、设备差异与部署问题，避免把时间浪费在重复误判上。"
        background="#f5f8ff"
        collapse
      >
        <div className={styles.listColumn}>
          {pitfalls.map((item, index) => (
            <div className={styles.listItem} key={item.link}>
              <Space>
                <Tag color="blue">{String(index + 1).padStart(2, '0')}</Tag>
                <Typography.Text>{item.title}</Typography.Text>
              </Space>
              <Link to={item.link} className={styles.sectionLink}>
                查看记录
                <ArrowRightOutlined />
              </Link>
            </div>
          ))}
        </div>
      </Group>
    </>
  );
};

export default Homepage;
