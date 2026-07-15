import React from 'react';
import { FloatButton } from 'antd';
import { createStyles } from 'antd-style';
import Toc from 'dumi/theme-default/slots/Toc';

import PrevAndNext from '../../common/PrevAndNext';
import Footer from '../Footer';
import SiteContext from '../SiteContext';

const useStyle = createStyles(({ css, cssVar, token }) => ({
  shell: css`
    flex: 1;
    min-width: 0;
    display: flex;
    gap: ${cssVar.marginXL}px;
  `,
  articleShell: css`
    flex: 1;
    min-width: 0;
    padding-inline-start: 64px;
    padding-inline-end: 48px;
  `,
  articleWrapper: css`
    max-width: 860px;
    min-height: calc(100vh - ${token.headerHeight}px);
  `,
  tocShell: css`
    width: 220px;
    flex: none;
    margin-inline-end: 24px;
    position: sticky;
    top: calc(${token.headerHeight}px + ${cssVar.marginLG}px);
    align-self: flex-start;
    max-height: calc(100vh - ${token.headerHeight}px - ${cssVar.marginLG}px * 2);
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-gutter: stable;
  `,
}));

export interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  const { styles } = useStyle();
  const { isMobile } = React.useContext(SiteContext);

  return (
    <>
      <div className={`${styles.shell} phoenix-content-shell`}>
        <div className={styles.articleShell}>
          <article className={styles.articleWrapper}>{children}</article>
          <FloatButton.BackTop />
        </div>
        {!isMobile && (
          <aside className={`${styles.tocShell} toc`}>
            <Toc />
          </aside>
        )}
      </div>
      <div>
        <PrevAndNext />
        <Footer />
      </div>
    </>
  );
};

export default Content;
