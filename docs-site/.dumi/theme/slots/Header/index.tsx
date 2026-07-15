import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GithubOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Col, ConfigProvider, Menu, Popover, Row, Select, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import { useAppData, useLocation, useSiteData } from 'dumi';
import DumiSearchBar from 'dumi/theme-default/slots/SearchBar';
import packageInfo from '../../../../package.json';

import Link from '../../common/Link';
import ThemeSwitch from '../../common/ThemeSwitch';
import DirectionIcon from '../../icons/DirectionIcon';
import SiteContext from '../SiteContext';
import SwitchBtn from './SwitchBtn';

const RESPONSIVE_XS = 1120;
const RESPONSIVE_SM = 1200;

const useStyle = createStyles(({ css, cssVar, token }) => ({
  header: css`
    position: sticky;
    top: 0;
    z-index: 1000;
    max-width: 100%;
    background: ${cssVar.colorBgContainer};
    box-shadow: ${cssVar.boxShadowTertiary};
    backdrop-filter: blur(8px);

    .dumi-default-search-bar {
      display: inline-flex;
      flex: auto;
      align-items: center;
      max-width: 220px;
      height: 32px;
      margin: 0;
      margin-inline-end: 16px !important;
      background: ${cssVar.colorBgContainer};
      border-radius: ${cssVar.borderRadiusSM}px;
      transition: background ${cssVar.motionDurationSlow};

      > svg {
        width: 14px;
        flex-shrink: 0;
        fill: #ced4d9;
        margin-inline-start: -6px;
      }

      > input {
        flex: 1;
        min-width: 0;
        height: 100%;
        padding-inline-start: 32px;
        border: 0;
        background: transparent;

        &:focus {
          box-shadow: none;
          background: transparent;
        }

        &::placeholder {
          color: #ced4d9;
        }
      }

      &:hover,
      &:focus-within {
        background: ${cssVar.colorFillSecondary};
      }

      .dumi-default-search-shortcut {
        display: none;
      }

      .dumi-default-search-popover {
        inset-inline-start: ${cssVar.paddingSM}px;
        inset-inline-end: unset;
        z-index: 1;

        &::before {
          inset-inline-start: 100px;
          inset-inline-end: unset;
        }

        > section {
          scrollbar-width: thin;
          scrollbar-gutter: stable;
        }
      }
    }
  `,
  logo: css`
    height: ${token.headerHeight}px;
    padding-inline-start: 40px;
    display: inline-flex;
    align-items: center;
    color: ${cssVar.colorTextHeading};
    font-weight: bold;
    font-size: 18px;
    font-family: Avenir, ${cssVar.fontFamily}, sans-serif;
    line-height: ${token.headerHeight}px;
    letter-spacing: -0.18px;
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

    @media only screen and (max-width: ${token.mobileMaxWidth}px) {
      padding-inline-start: 16px;
      padding-inline-end: 0;
    }
  `,
  logoTitle: css`
    line-height: 32px;
    margin-inline-start: ${cssVar.marginSM}px;
  `,
  nav: css`
    height: 100%;
    border: 0 !important;
    font-size: ${cssVar.fontSize}px;
    font-family: Avenir, ${cssVar.fontFamily}, sans-serif;
    background: transparent !important;

    &${token.antCls}-menu-horizontal {
      border-bottom: none;

      > ${token.antCls}-menu-item,
      > ${token.antCls}-menu-submenu {
        min-width: 56px;
        height: ${token.headerHeight}px;
        padding-inline-start: 8px;
        padding-inline-end: 8px;
        line-height: ${token.headerHeight}px;
      }
    }
  `,
  menuRow: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    column-gap: 2px;
    margin: 0;
    padding-inline-end: ${cssVar.paddingMD}px;

    > * {
      flex: none;
      margin: 0;
    }
  `,
  github: css`
    font-size: 16px;
  `,
  dataDirectionIcon: css`
    width: 20px;
  `,
  versionSelect: css`
    width: 88px;
    min-width: 88px;
    margin-inline-end: 6px;

    .rc-virtual-list-holder {
      scrollbar-width: thin;
      scrollbar-gutter: stable;
    }
  `,
  mobileMenuButton: css`
    font-size: 18px;
    margin-inline-end: 12px;
  `,
  popoverMenu: css`
    width: 300px;

    ${token.antCls}-popover-inner-content {
      padding: 0;
    }
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
  const { direction, isMobile, updateSiteConfig } = React.useContext(SiteContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1400);

  const navItems = (themeConfig.nav || []) as NavItem[];
  const githubUrl = themeConfig.socialLinks?.github;
  const isHome = pathname === '/' || pathname === '/index';

  useEffect(() => {
    const onWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    onWindowResize();
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

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

  const versionOptions = useMemo(
    () => [
      {
        value: packageInfo.version,
        label: packageInfo.version,
      },
    ],
    [],
  );

  const onDirectionChange = useCallback(() => {
    updateSiteConfig({ direction: direction !== 'rtl' ? 'rtl' : 'ltr' });
  }, [direction, updateSiteConfig]);

  const directionSwitch = (
    <SwitchBtn
      key="direction"
      onClick={onDirectionChange}
      value={direction === 'rtl' ? 2 : 1}
      label1={<DirectionIcon className={styles.dataDirectionIcon} direction="ltr" />}
      tooltip1="LTR"
      label2={<DirectionIcon className={styles.dataDirectionIcon} direction="rtl" />}
      tooltip2="RTL"
      pure
      aria-label="RTL Switch Button"
    />
  );

  const versionNode = (
    <Select
      key="version"
      size="small"
      variant="filled"
      className={styles.versionSelect}
      value={packageInfo.version}
      options={versionOptions}
      disabled
      popupMatchSelectWidth={false}
      getPopupContainer={(trigger) => trigger.parentNode}
    />
  );

  const githubNode =
    githubUrl && (
      <a key="github" href={githubUrl} target="_blank" rel="noopener noreferrer">
        <Tooltip title="GitHub" destroyOnHidden>
          <Button type="text" icon={<GithubOutlined />} className={styles.github} />
        </Tooltip>
      </a>
    );

  let responsive: null | 'narrow' | 'crowded' = null;
  if (windowWidth < RESPONSIVE_XS) {
    responsive = 'crowded';
  } else if (windowWidth < RESPONSIVE_SM) {
    responsive = 'narrow';
  }

  let desktopActions = [versionNode, directionSwitch, <ThemeSwitch key="theme" />, githubNode];

  if (responsive === 'crowded') {
    desktopActions = [directionSwitch, <ThemeSwitch key="theme" />, githubNode];
  }

  const mobileActions = [versionNode, directionSwitch, <ThemeSwitch key="theme" />, githubNode]
    .filter(Boolean);

  const colProps = isHome
    ? [{ flex: 'none' }, { flex: 'auto' }]
    : [
        { xxl: 4, xl: 5, lg: 6, md: 6, sm: 24, xs: 24 },
        { xxl: 20, xl: 19, lg: 18, md: 18, sm: 0, xs: 0 },
      ];

  return (
    <header className={styles.header}>
      <Row style={{ flexFlow: 'nowrap', height: 64 }}>
        <Col {...colProps[0]}>
          <h1 style={{ margin: 0 }}>
            <Link to="/" className={styles.logo}>
              <img src={`${base}favicon.svg`} alt="Phoenix Mini LLM" draggable={false} />
              <span className={styles.logoTitle}>{themeConfig.name || 'Phoenix Mini LLM'}</span>
            </Link>
          </h1>
        </Col>
        {!isMobile ? (
          <Col {...colProps[1]}>
            <div className={styles.menuRow}>
              <DumiSearchBar />
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
              {desktopActions}
            </div>
          </Col>
        ) : (
          <Col flex="auto">
            <div className={styles.menuRow}>
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Tooltip title="GitHub" destroyOnHidden>
                    <Button type="text" icon={<GithubOutlined />} className={styles.github} />
                  </Tooltip>
                </a>
              )}
              <Popover
                classNames={{ root: styles.popoverMenu }}
                placement="bottomRight"
                trigger="click"
                open={menuOpen}
                onOpenChange={setMenuOpen}
                content={
                  <>
                    <Menu
                      mode="inline"
                      selectedKeys={selectedKey}
                      items={menuItems}
                      onClick={() => setMenuOpen(false)}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px' }}>
                      {mobileActions}
                    </div>
                  </>
                }
              >
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  className={styles.mobileMenuButton}
                  aria-label="Open navigation"
                />
              </Popover>
            </div>
          </Col>
        )}
      </Row>
    </header>
  );
};

export default Header;
