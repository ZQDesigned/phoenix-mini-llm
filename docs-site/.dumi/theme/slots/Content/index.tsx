import React from 'react';
import { FloatButton } from 'antd';
import { createStyles } from 'antd-style';

import PrevAndNext from '../../common/PrevAndNext';
import Footer from '../Footer';
import SiteContext from '../SiteContext';
import DocAnchor, { useStyle as useDocAnchorStyle } from './DocAnchor';

const useStyle = createStyles(({ css, cssVar, token }) => ({
  root: css`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  `,
  shell: css`
    flex: 1;
    min-width: 0;
    display: block;
  `,
  articleShell: css`
    flex: 1;
    min-width: 0;
    padding-inline-start: 64px;
  `,
  articleWrapper: css`
    max-width: 100%;
    min-height: calc(100vh - ${token.headerHeight}px);
  `,
}));

export interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => {
  const { styles } = useStyle();
  const { styles: anchorStyles } = useDocAnchorStyle();
  const { isMobile } = React.useContext(SiteContext);

  return (
    <section className={styles.root}>
      <div className={`${styles.shell} phoenix-content-shell`}>
        <div className={styles.articleShell}>
          {!isMobile && <DocAnchor />}
          <article
            className={`${styles.articleWrapper} ${anchorStyles.articleWrapper} main-wrapper`}
          >
            {children}
          </article>
          <FloatButton.BackTop />
        </div>
      </div>
      <div>
        <PrevAndNext />
        <Footer />
      </div>
    </section>
  );
};

export default Content;
