import React from 'react';
import { ConfigProvider } from 'antd';
import { clsx } from 'clsx';
import { Helmet, useLocation, useOutlet, useSiteData } from 'dumi';

import GlobalStyles from '../../common/GlobalStyles';
import Header from '../../slots/Header';
import SiteContext from '../../slots/SiteContext';
import IndexLayout from '../IndexLayout';
import SidebarLayout from '../SidebarLayout';

const DocLayout: React.FC = () => {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const { direction } = React.useContext(SiteContext);
  const { themeConfig } = useSiteData();

  const content = React.useMemo(() => {
    if (pathname === '/' || pathname === '/index') {
      return (
        <IndexLayout
          title={themeConfig.name}
          desc="Phoenix Mini LLM: a learning-first documentation site and workshop for building a small decoder-only language model."
        >
          {outlet}
        </IndexLayout>
      );
    }

    return <SidebarLayout>{outlet}</SidebarLayout>;
  }, [outlet, pathname, themeConfig.name]);

  return (
    <>
      <Helmet>
        <html lang="zh-CN" data-direction={direction} className={clsx({ rtl: direction === 'rtl' })} />
      </Helmet>
      <ConfigProvider
        direction={direction}
        theme={{ token: { fontFamily: 'AlibabaSans, -apple-system, BlinkMacSystemFont, sans-serif' } }}
      >
        <GlobalStyles />
        <Header />
        {content}
      </ConfigProvider>
    </>
  );
};

export default DocLayout;
