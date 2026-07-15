import * as React from 'react';
import type { DirectionType } from 'antd/es/config-provider';
import type { ConfigComponentProps } from 'antd/es/config-provider/context';

import type { ThemeName } from '../common/siteTheme';

export type SimpleComponentClassNames = Partial<
  Record<keyof ConfigComponentProps, Record<string, string>>
>;

export interface SiteContextProps {
  isMobile: boolean;
  bannerVisible: boolean;
  direction: DirectionType;
  theme: ThemeName[];
  isDark: boolean;
  dynamicTheme?: {
    algorithm?: 'light' | 'dark';
    token: Record<string, string | number>;
  } & SimpleComponentClassNames;
  updateSiteConfig: (props: Partial<SiteContextProps>) => void;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  bannerVisible: false,
  direction: 'ltr',
  theme: ['auto'],
  isDark: false,
  updateSiteConfig: () => {},
});

export default SiteContext;
