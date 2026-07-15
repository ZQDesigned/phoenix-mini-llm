import React from 'react';
import { FastColor } from '@ant-design/fast-color';
import { BookOutlined, GithubOutlined, HistoryOutlined, LaptopOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import getAlphaColor from 'antd/es/theme/util/getAlphaColor';
import RcFooter from 'rc-footer';
import type { FooterColumn } from 'rc-footer/lib/column';

import Link from '../../common/Link';
import SiteContext from '../SiteContext';
import AdditionalInfo from './AdditionalInfo';

const useStyle = createStyles(({ css, cssVar, token }, isMobile: boolean) => {
  const background = new FastColor(getAlphaColor('#f0f3fa', '#fff'))
    .onBackground(token.colorBgContainer)
    .toHexString();

  return {
    holder: css`
      background: ${background};
    `,
    footer: css`
    background: ${background};
    color: ${cssVar.colorTextSecondary};
    box-shadow: inset 0 106px 36px -116px rgba(0, 0, 0, 0.14);

    * {
      box-sizing: border-box;
    }

    h2,
    a {
      color: ${cssVar.colorText};
    }

    .rc-footer-column {
      margin-bottom: ${isMobile ? 60 : 0}px;

      :last-child {
        margin-bottom: ${isMobile ? 20 : 0}px;
      }
    }

    .rc-footer-container {
      max-width: 1208px;
      margin-inline: auto;
      padding-inline: ${cssVar.marginXXL}px;
    }

    .rc-footer-bottom {
      box-shadow: inset 0 106px 36px -116px rgba(0, 0, 0, 0.14);
    }

    .rc-footer-bottom-container {
      font-size: ${cssVar.fontSize}px;
    }
  `,
  };
});

const Footer: React.FC = () => {
  const { isMobile } = React.useContext(SiteContext);
  const { styles } = useStyle(isMobile);

  const columns = React.useMemo<FooterColumn[]>(
    () => [
      {
        icon: <BookOutlined />,
        title: '文档路径',
        items: [
          { title: '首页', url: '/' },
          { title: '学习主线', url: '/learning' },
          { title: '复刻教程', url: '/tutorials' },
          { title: '踩坑记录', url: '/pitfalls' },
          { title: '项目总览', url: '/project-overview' },
        ],
      },
      {
        icon: <HistoryOutlined />,
        title: '项目约束',
        items: [
          { title: '6GB 显存目标', url: '/learning/01-what-you-are-building' },
          { title: 'Mac 开发 / Windows 训练', url: '/learning/02-python-environment-and-uv' },
          { title: '训练工程', url: '/learning/10-training-engineering' },
          { title: '推理与采样', url: '/learning/11-inference-and-sampling' },
        ],
      },
      {
        icon: <GithubOutlined />,
        title: '工程资源',
        items: [
          {
            title: 'GitHub 仓库',
            url: 'https://github.com/ZQDesigned/phoenix-mini-llm',
            openExternal: true,
          },
          {
            title: 'README',
            url: 'https://github.com/ZQDesigned/phoenix-mini-llm#readme',
            openExternal: true,
          },
          { title: 'PyTorch', url: 'https://pytorch.org/', openExternal: true },
          { title: 'dumi', url: 'https://d.umijs.org/', openExternal: true },
        ],
      },
      {
        icon: <LaptopOutlined />,
        title: '开发环境',
        items: [
          { title: 'uv 工作流', url: '/learning/02-python-environment-and-uv' },
          { title: 'Tokenizer 训练', url: '/tutorials/03-train-the-tokenizer' },
          { title: '训练器与 Checkpoint', url: '/tutorials/07-build-training-and-checkpointing' },
          { title: '部署与路径问题', url: '/pitfalls/07-github-pages-subpath-and-base-config' },
        ],
      },
    ],
    [],
  );

  const normalizedColumns = columns.map((column) => ({
    ...column,
    items: column.items.map((item) => ({
      ...item,
      LinkComponent: item.openExternal ? undefined : Link,
    })),
  }));

  return (
    <RcFooter
      columns={normalizedColumns as FooterColumn[]}
      className={`${styles.footer} rc-footer-light`}
      bottom={
        <>
          <div style={{ opacity: 0.4 }}>
            Built with <span style={{ color: '#ff4d4f' }}>❤</span> for deliberate learning
          </div>
          <div>Phoenix Mini LLM Documentation</div>
        </>
      }
    />
  );

  return (
    <>
      <div className={styles.holder}>{footerNode}</div>
      <AdditionalInfo />
    </>
  );
};

export default Footer;
