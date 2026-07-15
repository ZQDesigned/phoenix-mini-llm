import * as React from 'react';
import { createStyles } from 'antd-style';
import { useSiteData } from 'dumi';

import Link from '../../common/Link';
import type { SharedProps } from './interface';

const useStyle = createStyles(({ css, cssVar, token }) => ({
  logo: css`
    height: ${token.headerHeight}px;
    padding-inline-start: 40px;
    overflow: hidden;
    color: ${cssVar.colorTextHeading};
    font-weight: bold;
    font-size: 18px;
    font-family: Avenir, ${cssVar.fontFamily}, sans-serif;
    line-height: ${token.headerHeight}px;
    letter-spacing: -0.18px;
    white-space: nowrap;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    column-gap: ${cssVar.marginSM}px;

    &:hover {
      color: ${cssVar.colorTextHeading};
    }

    img {
      width: 32px;
      height: 32px;
      display: inline-block;
      vertical-align: middle;
    }

    @media only screen and (max-width: ${token.mobileMaxWidth}px) {
      padding-inline-start: 0;
      padding-inline-end: 0;
    }
  `,
  title: css`
    line-height: 32px;
  `,
}));

const Logo: React.FC<SharedProps> = () => {
  const { styles } = useStyle();
  const { themeConfig } = useSiteData();
  const logoBase =
    typeof themeConfig.docsBase === 'string' && themeConfig.docsBase ? themeConfig.docsBase : '/';

  return (
    <h1 style={{ margin: 0 }}>
      <Link to="/" className={styles.logo}>
        <img src={`${logoBase}favicon.svg`} draggable={false} alt="Phoenix Mini LLM" />
        <span className={styles.title}>{themeConfig.name || 'Phoenix Mini LLM'}</span>
      </Link>
    </h1>
  );
};

export default Logo;
