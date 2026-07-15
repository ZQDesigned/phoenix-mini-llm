import type { PropsWithChildren } from 'react';
import React from 'react';
import { createStaticStyles } from 'antd-style';

import CommonHelmet from '../../common/CommonHelmet';
import Content from '../../slots/Content';
import Sidebar from '../../slots/Sidebar';

const styles = createStaticStyles(({ css, cssVar }) => ({
  main: css`
    display: flex;
    margin-top: ${cssVar.marginXL};
  `,
}));

const SidebarLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className={`${styles.main} phoenix-sidebar-layout`}>
      <CommonHelmet />
      <Sidebar />
      <Content>{children}</Content>
    </main>
  );
};

export default SidebarLayout;
