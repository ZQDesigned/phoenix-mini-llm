import React from 'react';
import { GithubOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Drawer, Menu } from 'antd';
import { createStyles } from 'antd-style';
import { useAppData, useLocation, useSiteData } from 'dumi';
import DumiSearchBar from 'dumi/theme-default/slots/SearchBar';

import Link from '../../common/Link';
import SiteContext from '../SiteContext';

const useStyle = createStyles(({ css, cssVar, token }) => ({
  header: css`
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 100%;
    background: ${cssVar.colorBgContainer};
    box-shadow: ${cssVar.boxShadowTertiary};
    backdrop-filter: blur(8px);
  `,
  inner: css`
    height: ${token.headerHeight}px;
    max-width: 1440px;
    margin-inline: auto;
    padding-inline: ${cssVar.paddingLG}px;
    display: flex;
    align-items: center;
    gap: ${cssVar.marginLG}px;
  `,
  logo: css`
    display: inline-flex;
    align-items: center;
    column-gap: ${cssVar.marginSM}px;
    color: ${cssVar.colorTextHeading};
    font-weight: 700;
    font-size: 18px;
    font-family: Avenir, AlibabaSans, ${cssVar.fontFamily}, sans-serif;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: ${cssVar.colorTextHeading};
    }

    img {
      width: 32px;
      height: 32px;
      display: inline-block;
    }
  `,
  nav: css`
    flex: 1;
    min-width: 0;
    border-bottom: none !important;
    background: transparent !important;

    &${token.antCls}-menu-horizontal > ${token.antCls}-menu-item,
    &${token.antCls}-menu-horizontal > ${token.antCls}-menu-submenu {
      height: ${token.headerHeight}px;
      line-height: ${token.headerHeight}px;
      padding-inline: 10px;
    }
  `,
  right: css`
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${cssVar.marginXXS}px;
    flex: none;
  `,
  github: css`
    width: 32px;
    height: 32px;
    border-radius: ${cssVar.borderRadiusSM}px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${cssVar.colorText};
    transition: all ${cssVar.motionDurationSlow};

    &:hover {
      color: ${cssVar.colorPrimary};
      background: ${cssVar.colorFillTertiary};
    }
  `,
  mobileMenuButton: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `,
}));

type NavItem = {
  title: string;
  link: string;
};

const normalizePath = (path: string) => {
  const normalized = path.replace(/\/$/, '');
  return normalized || '/';
};

const isExternalLink = (href: string) => /^https?:\/\//.test(href);

const Header: React.FC = () => {
  const { styles } = useStyle();
  const { themeConfig } = useSiteData();
  const { base = '/' } = useAppData();
  const { pathname } = useLocation();
  const { isMobile } = React.useContext(SiteContext);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navItems = (themeConfig.nav || []) as NavItem[];
  const githubUrl = themeConfig.socialLinks?.github;
  const selectedKey = React.useMemo(() => {
    const currentPath = normalizePath(pathname);
    const internalItems = navItems.filter((item) => !isExternalLink(item.link));
    const matched = [...internalItems]
      .sort((left, right) => right.link.length - left.link.length)
      .find((item) => {
        const target = normalizePath(item.link);
        return target === '/'
          ? currentPath === '/'
          : currentPath === target || currentPath.startsWith(`${target}/`);
      });

    return matched?.link ? [matched.link] : [];
  }, [navItems, pathname]);

  const menuItems = React.useMemo(
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
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <img src={`${base}favicon.svg`} alt="Phoenix Mini LLM" draggable={false} />
          <span>{themeConfig.name || 'Phoenix Mini LLM'}</span>
        </Link>
        {!isMobile && (
          <ConfigProvider
            theme={{
              token: {
                colorBgContainer: 'transparent',
              },
            }}
          >
            <Menu
              mode="horizontal"
              selectedKeys={selectedKey}
              className={styles.nav}
              items={menuItems}
            />
          </ConfigProvider>
        )}
        <div className={styles.right}>
          {!isMobile && <DumiSearchBar />}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.github}
              aria-label="GitHub"
            >
              <GithubOutlined />
            </a>
          )}
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              className={styles.mobileMenuButton}
              aria-label="Open navigation"
              onClick={() => setMenuOpen(true)}
            />
          )}
        </div>
      </div>
      <Drawer
        title={themeConfig.name || 'Phoenix Mini LLM'}
        placement="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      >
        <Menu
          mode="inline"
          selectedKeys={selectedKey}
          items={menuItems}
          onClick={() => setMenuOpen(false)}
        />
      </Drawer>
    </header>
  );
};

export default Header;
