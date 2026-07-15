import React from 'react';
import {
  BgColorsOutlined,
  ColumnWidthOutlined,
  MoonOutlined,
  SunOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Badge, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';

import useLocalStorage from '../../hooks/useLocalStorage';
import SiteContext from '../slots/SiteContext';
import { PHOENIX_SITE_THEME, type ThemeName } from './siteTheme';

const COLOR_THEMES: ThemeName[] = ['light', 'dark', 'auto'];
const OPTIONAL_THEMES: ThemeName[] = ['compact', 'motion-off'];

const ThemeSwitch: React.FC = () => {
  const { theme, updateSiteConfig } = React.useContext(SiteContext);
  const [, setStoredTheme] = useLocalStorage<ThemeName>(PHOENIX_SITE_THEME, {
    defaultValue: undefined,
  });

  const badge = <Badge color="blue" style={{ marginTop: -1 }} />;

  const setTheme = React.useCallback(
    (key: ThemeName) => {
      if (COLOR_THEMES.includes(key)) {
        const filteredTheme = theme.filter((item) => !COLOR_THEMES.includes(item));
        updateSiteConfig({ theme: [...filteredTheme, key] });
        setStoredTheme(key);
        return;
      }

      if (OPTIONAL_THEMES.includes(key)) {
        const nextTheme = theme.includes(key)
          ? theme.filter((item) => item !== key)
          : [...theme, key];
        updateSiteConfig({ theme: nextTheme });
      }
    },
    [setStoredTheme, theme, updateSiteConfig],
  );

  const items = React.useMemo<MenuProps['items']>(
    () => [
      {
        key: 'auto',
        icon: <SyncOutlined />,
        label: '跟随系统',
        extra: theme.includes('auto') ? badge : null,
      },
      {
        key: 'light',
        icon: <SunOutlined />,
        label: '浅色',
        extra: theme.includes('light') ? badge : null,
      },
      {
        key: 'dark',
        icon: <MoonOutlined />,
        label: '深色',
        extra: theme.includes('dark') ? badge : null,
      },
      { type: 'divider' },
      {
        key: 'compact',
        icon: <ColumnWidthOutlined />,
        label: '紧凑布局',
        extra: theme.includes('compact') ? badge : null,
      },
    ],
    [badge, theme],
  );

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => setTheme(key as ThemeName),
      }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button type="text" icon={<BgColorsOutlined />} aria-label="Theme switch" />
    </Dropdown>
  );
};

export default ThemeSwitch;
