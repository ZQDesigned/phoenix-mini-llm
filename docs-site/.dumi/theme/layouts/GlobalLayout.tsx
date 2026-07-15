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
import type { MappingAlgorithm } from 'antd';
import type { DirectionType, ThemeConfig } from 'antd/es/config-provider';
import {
  createSearchParams,
  useOutlet,
  useSearchParams,
  useServerInsertedHTML,
} from 'dumi';

import useLayoutState from '../../hooks/useLayoutState';
import useLocalStorage from '../../hooks/useLocalStorage';
import SiteThemeProvider from '../SiteThemeProvider';
import { PHOENIX_SITE_THEME, type ThemeName } from '../common/siteTheme';
import SiteContext, { type SiteContextProps } from '../slots/SiteContext';

type SiteState = Partial<Omit<SiteContextProps, 'updateSiteConfig'>>;

const RESPONSIVE_MOBILE = 768;

const getAlgorithm = (themes: ThemeName[] = [], systemTheme: 'dark' | 'light') =>
  themes
    .map((theme) => {
      if (theme === 'auto' && systemTheme === 'dark') {
        return antdTheme.darkAlgorithm;
      }

      if (theme === 'dark') {
        return antdTheme.darkAlgorithm;
      }

      if (theme === 'compact') {
        return antdTheme.compactAlgorithm;
      }

      return null as unknown as MappingAlgorithm;
    })
    .filter(Boolean);

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const isThemeDark = (theme: ThemeName[], systemTheme: 'dark' | 'light') =>
  theme.includes('dark') || (theme.includes('auto') && systemTheme === 'dark');

const getFinalTheme = (urlTheme: ThemeName[], storedTheme?: ThemeName): ThemeName[] => {
  const baseTheme = urlTheme.filter((theme) => !['light', 'dark', 'auto'].includes(theme));
  const urlColor = urlTheme.find((theme) => theme === 'light' || theme === 'dark');

  if (urlColor) {
    return [...baseTheme, urlColor];
  }

  if (storedTheme && ['light', 'dark', 'auto'].includes(storedTheme)) {
    return [...baseTheme, storedTheme];
  }

  return [...baseTheme, 'auto'];
};

const GlobalLayout: React.FC = () => {
  const outlet = useOutlet();
  const [searchParams, setSearchParams] = useSearchParams();
  const [
    {
      theme = ['auto'],
      direction = 'ltr',
      isMobile = false,
      bannerVisible = false,
      dynamicTheme,
      isDark = false,
    },
    setSiteState,
  ] = useLayoutState<SiteState>({
    isMobile: false,
    direction: 'ltr',
    theme: ['auto'],
    isDark: false,
    bannerVisible: false,
    dynamicTheme: undefined,
  });
  const [storedTheme] = useLocalStorage<ThemeName>(PHOENIX_SITE_THEME, {
    defaultValue: undefined,
  });
  const [systemTheme, setSystemTheme] = React.useState<'light' | 'dark'>(() => getSystemTheme());
  const styleCache = React.useMemo(() => createCache(), []);

  const updateSiteConfig = React.useCallback(
    (props: Partial<SiteContextProps>) => {
      const { updateSiteConfig: _ignored, ...nextState } = props;

      setSiteState((prev) => ({ ...prev, ...nextState }));

      const oldSearch = searchParams.toString();
      let nextSearchParams: URLSearchParams = searchParams;

      Object.entries(nextState).forEach(([key, value]) => {
        if (key === 'direction') {
          if (value === 'rtl') {
            nextSearchParams.set('direction', 'rtl');
          } else {
            nextSearchParams.delete('direction');
          }
        }

        if (key === 'theme') {
          const themeValue = Array.isArray(value) ? value : [value];
          const base = themeValue.filter((theme) => !['light', 'dark', 'auto'].includes(theme));
          const color = themeValue.find((theme) => theme === 'light' || theme === 'dark');

          if (color) {
            nextSearchParams = createSearchParams({
              ...Object.fromEntries(nextSearchParams.entries()),
              theme: [...base, color],
            });
          } else {
            nextSearchParams.delete('theme');
          }
        }
      });

      if (nextSearchParams.toString() !== oldSearch) {
        setSearchParams(nextSearchParams);
      }
    },
    [searchParams, setSearchParams, setSiteState],
  );

  const updateMobileMode = React.useCallback(() => {
    updateSiteConfig({ isMobile: window.innerWidth < RESPONSIVE_MOBILE });
  }, [updateSiteConfig]);

  React.useEffect(() => {
    const color = theme.find((themeName) => themeName === 'light' || themeName === 'dark');
    const html = document.querySelector<HTMLHtmlElement>('html');

    if (theme.includes('auto')) {
      html?.setAttribute('data-prefers-color', systemTheme);
    } else if (color) {
      html?.setAttribute('data-prefers-color', color);
    }

    const nextIsDark = isThemeDark(theme, systemTheme);

    setSiteState((prev) => {
      if (prev.isDark === nextIsDark) {
        return prev;
      }

      return { ...prev, isDark: nextIsDark };
    });
  }, [setSiteState, systemTheme, theme]);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  React.useEffect(() => {
    const urlTheme = searchParams.getAll('theme') as ThemeName[];
    const finalTheme = getFinalTheme(urlTheme, storedTheme);
    const nextDirection = searchParams.get('direction') as DirectionType | null;

    setSiteState((prev) => ({
      ...prev,
      theme: finalTheme,
      isDark: isThemeDark(finalTheme, systemTheme),
      direction: nextDirection === 'rtl' ? 'rtl' : 'ltr',
      bannerVisible: false,
    }));

    updateMobileMode();
    window.addEventListener('resize', updateMobileMode);

    return () => {
      window.removeEventListener('resize', updateMobileMode);
    };
  }, [searchParams, setSiteState, storedTheme, systemTheme, updateMobileMode]);

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
      direction,
      updateSiteConfig,
      theme,
      isDark,
      isMobile,
      bannerVisible,
      dynamicTheme,
    }),
    [bannerVisible, direction, dynamicTheme, isDark, isMobile, theme, updateSiteConfig],
  );

  const themeConfig = React.useMemo<ThemeConfig>(() => {
    const { algorithm: _ignoredAlgorithm, token: dynamicToken = {} } = dynamicTheme || {
      token: {},
    };

    return {
      algorithm: getAlgorithm(theme, systemTheme),
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 8,
        motion: !theme.includes('motion-off'),
        ...dynamicToken,
      },
    };
  }, [dynamicTheme, systemTheme, theme]);

  return (
    <StyleProvider
      cache={styleCache}
      layer
      linters={[legacyNotSelectorLinter, parentSelectorLinter, NaNLinter]}
    >
      <SiteContext value={siteContextValue}>
        <SiteThemeProvider theme={themeConfig}>
          <ConfigProvider theme={themeConfig}>
            <App>{outlet}</App>
          </ConfigProvider>
        </SiteThemeProvider>
      </SiteContext>
    </StyleProvider>
  );
};

export default GlobalLayout;
