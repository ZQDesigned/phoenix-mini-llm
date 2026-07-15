import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { clsx } from 'clsx';
import { Helmet, useLocation, useOutlet, useSearchParams, useSiteData } from 'dumi';

import GlobalStyles from '../../common/GlobalStyles';
import Header from '../../slots/Header';
import SiteContext from '../../slots/SiteContext';
import IndexLayout from '../IndexLayout';
import SidebarLayout from '../SidebarLayout';

const DocLayout: React.FC = () => {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { direction } = React.useContext(SiteContext);
  const { themeConfig } = useSiteData();
  const { token } = theme.useToken();
  const hideLayout = searchParams.get('layout') === 'false';

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
      <Helmet encodeSpecialCharacters={false}>
        <html lang="zh-CN" data-direction={direction} className={clsx({ rtl: direction === 'rtl' })} />
        <meta
          property="og:description"
          content="Phoenix Mini LLM documentation for learning-first small language model development."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <ConfigProvider
        direction={direction}
        theme={{ token: { fontFamily: `AlibabaSans, ${token.fontFamily}` } }}
      >
        <GlobalStyles />
        {!hideLayout && <Header />}
        {content}
      </ConfigProvider>
    </>
  );
};

export default DocLayout;
