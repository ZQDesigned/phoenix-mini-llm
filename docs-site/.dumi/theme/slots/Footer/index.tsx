import React from 'react';
import { createStyles } from 'antd-style';
import RcFooter from 'rc-footer';

import Link from '../../common/Link';
import SiteContext from '../SiteContext';

const useStyle = createStyles(({ css, cssVar }, isMobile: boolean) => ({
  footer: css`
    background: #000;
    color: ${cssVar.colorTextSecondary};
    box-shadow: inset 0 106px 36px -116px rgba(0, 0, 0, 0.14);

    * {
      box-sizing: border-box;
    }

    h2,
    a {
      color: rgba(255, 255, 255, 0.92);
    }

    .rc-footer-column {
      margin-bottom: ${isMobile ? 60 : 0}px;
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
}));

const Footer: React.FC = () => {
  const { isMobile } = React.useContext(SiteContext);
  const { styles } = useStyle(isMobile);

  const columns = React.useMemo(
    () => [
      {
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
        title: '项目约束',
        items: [
          { title: '6GB 显存目标', url: '/learning/01-what-you-are-building' },
          { title: 'Mac 开发 / Windows 训练', url: '/learning/02-python-environment-and-uv' },
          { title: '训练工程', url: '/learning/10-training-engineering' },
          { title: '推理与采样', url: '/learning/11-inference-and-sampling' },
        ],
      },
      {
        title: '工程资源',
        items: [
          {
            title: 'GitHub 仓库',
            url: 'https://github.com/ZQDesigned/phoenix-mini-llm',
            openExternal: true,
          },
          { title: 'README', url: 'https://github.com/ZQDesigned/phoenix-mini-llm#readme', openExternal: true },
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
      LinkComponent: item.openExternal ? undefined : Link,
    })),
  }));

  return (
    <RcFooter
      columns={normalizedColumns as any}
      className={styles.footer}
      bottom={
        <>
          <div style={{ opacity: 0.4 }}>Built for learning and careful reproduction</div>
          <div>Phoenix Mini LLM</div>
        </>
      }
    />
  );
};

export default Footer;
