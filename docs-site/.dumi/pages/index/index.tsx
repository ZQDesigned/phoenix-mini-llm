import React from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Tag, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { Helmet } from 'dumi';

import Link from '../../theme/common/Link';
import LinkButton from '../../theme/common/LinkButton';
import { learningBookOverviewLinks } from '../../../src/content/learning';
import BannerRecommends from './components/BannerRecommends';
import Group from './components/Group';
import PreviewBanner from './components/PreviewBanner';

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
      <section className="home-page-wrapper">
        <PreviewBanner
          title="Phoenix Mini LLM"
          description="面向初学者的大模型基础开发知识档案、完整复刻教程与真实踩坑记录。先懂原理，再从空目录一步一步写出和当前仓库一致的小型语言模型。"
          actions={
            <>
              <LinkButton to="/learning" size="large" type="primary">
                从零学习
              </LinkButton>
              <LinkButton to="/tutorials" size="large">
                开始复刻
              </LinkButton>
              <LinkButton to="/pitfalls" size="large">
                查看踩坑记录
              </LinkButton>
            </>
          }
        >
          <BannerRecommends />
        </PreviewBanner>

        <Group
          id="learning"
          title="学习主线"
          description="按“分册 + 章节”组织的书籍化知识档案，从语言模型概念、神经网络基础、文本数据、Transformer、训练、推理到调试逐步展开。"
          background="#ffffff"
          collapse
        >
          <div className={styles.denseGrid}>
            {learningBookOverviewLinks.map((part) => (
              <Card key={part.link} className={styles.chapterCard}>
                <Typography.Title level={5}>{part.title}</Typography.Title>
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                  {part.description}
                </Typography.Paragraph>
                <Link to={part.link} className={styles.sectionLink}>
                  进入分册
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
          decoration={
            <img
              draggable={false}
              src="https://gw.alipayobjects.com/zos/bmw-prod/ba37a413-28e6-4be4-b1c5-01be1a0ebb1c.svg"
              alt="bg"
              style={{
                position: 'absolute',
                insetInlineStart: 0,
                top: -50,
                height: 160,
              }}
            />
          }
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
      </section>
    </>
  );
};

export default Homepage;
