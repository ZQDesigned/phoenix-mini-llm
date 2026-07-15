import React from 'react';
import { Flex, Typography } from 'antd';
import { createStyles } from 'antd-style';

import GroupMaskLayer from './GroupMaskLayer';

const useStyle = createStyles(({ cssVar, css, cx }) => {
  const textShadow = `0 0 4px ${cssVar.colorBgContainer}`;

  const block = cx(css`
    position: absolute;
    inset-inline-end: -60px;
    top: -24px;
    transition: all 1s cubic-bezier(0.03, 0.98, 0.52, 0.99);
  `);

  return {
    holder: css`
      position: relative;
      display: flex;
      height: 640px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      perspective: 800px;
      transform: translateZ(1000px);
      row-gap: ${cssVar.marginXL};
      background:
        radial-gradient(circle at 50% 14%, rgba(22, 119, 255, 0.16), transparent 28%),
        radial-gradient(circle at 82% 18%, rgba(114, 46, 209, 0.12), transparent 24%),
        linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);

      &:hover {
        .${block} {
          transform: scale(0.96);
        }
      }
    `,
    typography: css`
      position: relative;
      z-index: 1;
      padding-inline: ${cssVar.paddingXL};
      text-align: center;
      text-shadow: ${Array.from({ length: 5 }, () => textShadow).join(', ')};

      h1 {
        font-weight: 900 !important;
        font-size: calc(${cssVar.fontSizeHeading1} * 2) !important;
        line-height: ${cssVar.lineHeightHeading1} !important;
      }

      p {
        margin-bottom: 0 !important;
        color: ${cssVar.colorTextTertiary} !important;
        font-size: calc(${cssVar.fontSizeLG} * 1.3) !important;
        font-weight: 400 !important;
      }
    `,
    child: css`
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding-inline: ${cssVar.marginXXL}px;
      box-sizing: border-box;
    `,
    btnWrap: css`
      margin-bottom: ${cssVar.marginXL};
    `,
  };
});

export interface PreviewBannerProps {
  title: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
}

const PreviewBanner: React.FC<Readonly<React.PropsWithChildren<PreviewBannerProps>>> = ({
  children,
  title,
  description,
  actions,
}) => {
  const { styles } = useStyle();

  return (
    <GroupMaskLayer>
      <div className={styles.holder}>
        <Typography className={styles.typography}>
          <h1>{title}</h1>
          <p>{description}</p>
        </Typography>
        {actions ? (
          <Flex gap="middle" className={styles.btnWrap}>
            {actions}
          </Flex>
        ) : null}
        <div className={styles.child}>{children}</div>
      </div>
    </GroupMaskLayer>
  );
};

export default PreviewBanner;
