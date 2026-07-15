import React from 'react';
import {
  createCache,
  extractStyle,
  legacyNotSelectorLinter,
  NaNLinter,
  parentSelectorLinter,
  StyleProvider,
} from '@ant-design/cssinjs';
import { App, ConfigProvider, theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import { useOutlet, useServerInsertedHTML } from 'dumi';

import SiteThemeProvider from '../SiteThemeProvider';
import SiteContext, { type SiteContextProps } from '../slots/SiteContext';

type SiteState = Omit<SiteContextProps, 'updateSiteConfig'>;

const defaultTheme: ThemeConfig = {
  algorithm: [antdTheme.defaultAlgorithm],
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
  },
};

const GlobalLayout: React.FC = () => {
  const outlet = useOutlet();
  const [siteState, setSiteState] = React.useState<SiteState>({
    isMobile: false,
    direction: 'ltr',
    theme: ['light'],
    isDark: false,
  });
  const styleCache = React.useMemo(() => createCache(), []);

  const updateSiteConfig = React.useCallback((props: Partial<SiteContextProps>) => {
    const { updateSiteConfig: _ignored, ...nextState } = props;

    setSiteState((prev) => ({ ...prev, ...nextState }));
  }, []);

  React.useEffect(() => {
    const updateMobileMode = () => {
      setSiteState((prev) => ({ ...prev, isMobile: window.innerWidth < 768 }));
    };

    updateMobileMode();
    window.addEventListener('resize', updateMobileMode);

    return () => {
      window.removeEventListener('resize', updateMobileMode);
    };
  }, []);

  useServerInsertedHTML(() => {
    const styleText = extractStyle(styleCache, { plain: true, types: 'style' });

    return <style data-type="antd-cssinjs" dangerouslySetInnerHTML={{ __html: styleText }} />;
  });

  useServerInsertedHTML(() => {
    const styleText = extractStyle(styleCache, { plain: true, types: ['cssVar', 'token'] });

    return (
      <style
        data-type="antd-css-var"
        data-rc-order="prepend"
        data-rc-priority="-9999"
        dangerouslySetInnerHTML={{ __html: styleText }}
      />
    );
  });

  const siteContextValue = React.useMemo<SiteContextProps>(
    () => ({
      ...siteState,
      updateSiteConfig,
    }),
    [siteState, updateSiteConfig],
  );

  return (
    <StyleProvider
      cache={styleCache}
      layer
      linters={[legacyNotSelectorLinter, parentSelectorLinter, NaNLinter]}
    >
      <SiteContext value={siteContextValue}>
        <SiteThemeProvider theme={defaultTheme}>
          <ConfigProvider theme={defaultTheme}>
            <App>{outlet}</App>
          </ConfigProvider>
        </SiteThemeProvider>
      </SiteContext>
    </StyleProvider>
  );
};

export default GlobalLayout;
