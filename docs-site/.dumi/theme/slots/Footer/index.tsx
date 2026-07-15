import React from 'react';
import { FastColor } from '@ant-design/fast-color';
import {
  BgColorsOutlined,
  GithubOutlined,
  HistoryOutlined,
  QuestionCircleOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import getAlphaColor from 'antd/es/theme/util/getAlphaColor';
import { Link as DumiLink } from 'dumi';
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

      .rc-footer-item-icon {
        top: -1.5px;
      }

      .rc-footer-container {
        max-width: 1208px;
        margin-inline: auto;
        padding-inline: ${cssVar.marginXXL}px;
      }

      .rc-footer-bottom {
        box-shadow: inset 0 106px 36px -116px rgba(0, 0, 0, 0.14);

        .rc-footer-bottom-container {
          font-size: ${cssVar.fontSize}px;
        }
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
        icon: <RobotOutlined />,
        title: '学习路线',
        items: [
          { title: '学习主线', url: '/learning' },
          { title: '复刻教程', url: '/tutorials' },
          { title: '踩坑记录', url: '/pitfalls' },
          { title: '项目总览', url: '/project-overview' },
        ],
      },
      {
        icon: <HistoryOutlined />,
        title: '关键章节',
        items: [
          { title: '6GB 显存目标', url: '/learning/01-what-you-are-building' },
          { title: '环境与 uv', url: '/learning/02-python-environment-and-uv' },
          { title: '训练工程', url: '/learning/10-training-engineering' },
          { title: '推理与采样', url: '/learning/11-inference-and-sampling' },
        ],
      },
      {
        icon: <BgColorsOutlined />,
        title: '复刻入口',
        items: [
          { title: '建立项目骨架', url: '/tutorials/01-bootstrap-the-project' },
          { title: '训练 Tokenizer', url: '/tutorials/03-train-the-tokenizer' },
          { title: '拼出主模型', url: '/tutorials/06-assemble-the-model' },
          { title: '跑出基线结果', url: '/tutorials/10-reproduce-the-baseline' },
        ],
      },
      {
        icon: <QuestionCircleOutlined />,
        title: '排障与约束',
        items: [
          { title: '.gitignore 误伤', url: '/pitfalls/02-gitignore-and-package-names' },
          { title: 'MPS / CUDA 差异', url: '/pitfalls/05-mps-vs-cuda-and-amp' },
          { title: 'GitHub Pages 子路径', url: '/pitfalls/07-github-pages-subpath-and-base-config' },
          { title: 'dumi 布局覆写', url: '/pitfalls/06-overriding-dumi-default-layout' },
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
    ],
    [],
  );

  const normalizedColumns = columns.map((column) => ({
    ...column,
    items: column.items.map((item) => ({
      ...item,
      LinkComponent: item.openExternal ? undefined : (Link as typeof DumiLink),
    })),
  }));

  return (
    <>
      <div className={styles.holder}>
        <RcFooter
          columns={normalizedColumns as FooterColumn[]}
          className={`${styles.footer} rc-footer-light`}
          bottom={
            <>
              <div style={{ opacity: 0.45 }}>
                Built for deliberate learning, reconstruction, and debugging.
              </div>
              <div>Phoenix Mini LLM Documentation</div>
            </>
          }
        />
      </div>
      <AdditionalInfo />
    </>
  );
};

export default Footer;
