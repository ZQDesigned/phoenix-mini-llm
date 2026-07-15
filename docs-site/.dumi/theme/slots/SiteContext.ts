import * as React from 'react';
import type { DirectionType } from 'antd/es/config-provider';

export interface SiteContextProps {
  isMobile: boolean;
  direction: DirectionType;
  theme: string[];
  isDark: boolean;
  updateSiteConfig: (props: Partial<SiteContextProps>) => void;
}

const SiteContext = React.createContext<SiteContextProps>({
  isMobile: false,
  direction: 'ltr',
  theme: ['light'],
  isDark: false,
  updateSiteConfig: () => {},
});

export default SiteContext;
