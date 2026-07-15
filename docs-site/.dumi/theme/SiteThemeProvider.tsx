import React from 'react';
import { updateCSS } from '@rc-component/util';
import { theme as antdTheme, ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';
import type { ThemeProviderProps } from 'antd-style';
import { ThemeProvider } from 'antd-style';

import SiteContext from './slots/SiteContext';

interface PhoenixCustomToken {
  antCls: string;
  iconCls: string;
  headerHeight: number;
  bannerHeight: number;
  menuItemBorder: number;
  mobileMaxWidth: number;
  siteMarkdownCodeBg: string;
  siteMarkdownCodeBgDark: string;
  codeFamily: string;
  anchorTop: number;
  marginFarXS: number;
  marginFarSM: number;
  marginFar: number;
}

declare module 'antd-style' {
  export interface CustomToken extends PhoenixCustomToken {}
}

const HEADER_HEIGHT = 64;
const BANNER_HEIGHT = 38;

const SiteThemeProvider: React.FC<ThemeProviderProps<any>> = ({ children, theme, ...rest }) => {
  const { getPrefixCls, iconPrefixCls } = React.use(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const { token } = antdTheme.useToken();
  const { bannerVisible, isMobile } = React.useContext(SiteContext);

  React.useEffect(() => {
    ConfigProvider.config({ theme: theme as ThemeConfig });
  }, [theme]);

  React.useEffect(() => {
    if (window.parent !== window) {
      updateCSS(
        `
      [data-prefers-color='dark'] {
        color-scheme: dark !important;
      }

      [data-prefers-color='light'] {
        color-scheme: light !important;
      }
      `,
        'color-scheme',
      );
    }
  }, [theme]);

  return (
    <ThemeProvider<PhoenixCustomToken>
      {...rest}
      theme={theme}
      customToken={{
        antCls: `.${rootPrefixCls}`,
        iconCls: `.${iconPrefixCls}`,
        headerHeight: HEADER_HEIGHT,
        bannerHeight: BANNER_HEIGHT,
        menuItemBorder: 2,
        mobileMaxWidth: 767.99,
        siteMarkdownCodeBg: token.colorFillTertiary,
        siteMarkdownCodeBgDark: '#000',
        codeFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
        anchorTop:
          HEADER_HEIGHT +
          (isMobile ? token.margin : token.marginLG) +
          (bannerVisible ? BANNER_HEIGHT : 0),
        marginFarXS: (token.marginXXL / 6) * 7,
        marginFarSM: (token.marginXXL / 3) * 5,
        marginFar: token.marginXXL * 2,
      }}
    >
      {children}
    </ThemeProvider>
  );
};

export default SiteThemeProvider;
