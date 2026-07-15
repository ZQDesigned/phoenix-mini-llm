import * as React from 'react';
import type { MenuProps } from 'antd';
import { ConfigProvider, Menu } from 'antd';
import { createStyles } from 'antd-style';
import { useLocation, useSiteData } from 'dumi';

import Link from '../../common/Link';
import type { SharedProps } from './interface';

const useStyle = createStyles(({ css, cssVar, token }) => ({
  nav: css`
    height: 100%;
    font-size: ${cssVar.fontSize}px;
    font-family: Avenir, ${cssVar.fontFamily}, sans-serif;
    border: 0 !important;

    &${token.antCls}-menu-horizontal {
      border-bottom: none;

      > ${token.antCls}-menu-item,
      > ${token.antCls}-menu-submenu {
        min-width: 56px;
        height: ${token.headerHeight}px;
        padding-inline-end: 8px;
        padding-inline-start: 8px;
        line-height: ${token.headerHeight}px;
      }

      & ${token.antCls}-menu-submenu-title ${token.iconCls} {
        margin: 0;
      }

      > ${token.antCls}-menu-item-selected {
        a {
          color: ${cssVar.colorPrimary};
        }
      }
    }

    > ${token.antCls}-menu-item,
    > ${token.antCls}-menu-submenu {
      text-align: center;
    }
  `,
}));

type NavItem = {
  title: string;
  link: string;
};

export interface NavigationProps extends SharedProps {
  isMobile: boolean;
  responsive: null | 'narrow' | 'crowded';
}

const normalizePath = (path: string) => {
  const normalized = path.replace(/\/$/, '');
  return normalized || '/';
};

const isExternalLink = (href: string) => /^https?:\/\//.test(href);

const Navigation: React.FC<NavigationProps> = ({ isMobile }) => {
  const { styles } = useStyle();
  const { pathname } = useLocation();
  const { themeConfig } = useSiteData();
  const navItems = (themeConfig.nav || []) as NavItem[];

  const internalItems = React.useMemo(
    () => navItems.filter((item) => !isExternalLink(item.link)),
    [navItems],
  );

  const activeMenuItem = React.useMemo(() => {
    const currentPath = normalizePath(pathname);
    const matched = [...internalItems]
      .sort((left, right) => right.link.length - left.link.length)
      .find((item) => {
        const target = normalizePath(item.link);

        return target === '/'
          ? currentPath === '/'
          : currentPath === target || currentPath.startsWith(`${target}/`);
      });

    return matched?.link || 'home';
  }, [internalItems, pathname]);

  const items = React.useMemo<MenuProps['items']>(
    () =>
      navItems.map((item) => ({
        key: item.link,
        label: isExternalLink(item.link) ? (
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        ) : (
          <Link to={item.link}>{item.title}</Link>
        ),
      })),
    [navItems],
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorBgContainer: 'transparent',
        },
      }}
    >
      <Menu
        mode={isMobile ? 'inline' : 'horizontal'}
        selectedKeys={[activeMenuItem]}
        className={styles.nav}
        disabledOverflow
        items={items}
      />
    </ConfigProvider>
  );
};

export default Navigation;
