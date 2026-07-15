import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { GithubOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Select, Tooltip } from 'antd';
import { createStyles } from 'antd-style';
import { clsx } from 'clsx';
import { useLocation, useSiteData } from 'dumi';
import DumiSearchBar from 'dumi/theme-default/slots/SearchBar';
import packageInfo from '../../../../package.json';

import ThemeSwitch from '../../common/ThemeSwitch';
import DirectionIcon from '../../icons/DirectionIcon';
import SiteContext from '../SiteContext';
import type { SharedProps } from './interface';
import Logo from './Logo';
import Navigation from './Navigation';
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
        align-items: center;
        flex: auto;
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
  popoverMenu: css`
    width: 300px;

    ${token.antCls}-popover-inner-content {
      padding: 0;
    }
  `,
}));

const Header: React.FC = () => {
  const { styles } = useStyle();
  const { themeConfig } = useSiteData();
  const location = useLocation();
  const { pathname } = location;
  const { direction, isMobile, updateSiteConfig } = React.useContext(SiteContext);
  const [headerState, setHeaderState] = useState({
    menuVisible: false,
    windowWidth: 1400,
  });

  useEffect(() => {
    const onWindowResize = () => {
      setHeaderState((prev) => ({ ...prev, windowWidth: window.innerWidth }));
    };

    onWindowResize();
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  const handleHideMenu = useCallback(() => {
    setHeaderState((prev) => ({ ...prev, menuVisible: false }));
  }, []);

  useEffect(() => {
    handleHideMenu();
  }, [handleHideMenu, location]);

  const onDirectionChange = useCallback(() => {
    updateSiteConfig({ direction: direction !== 'rtl' ? 'rtl' : 'ltr' });
  }, [direction, updateSiteConfig]);

  const versionOptions = useMemo(
    () => [
      {
        value: packageInfo.version,
        label: packageInfo.version,
      },
    ],
    [],
  );

  const githubUrl = themeConfig.socialLinks?.github;
  const isHome = ['', '/', '/index'].includes(pathname);
  const sharedProps: SharedProps = {
    isRTL: direction === 'rtl',
  };
  const { menuVisible, windowWidth } = headerState;

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

  const navigationNode = (
    <Navigation
      key="nav"
      {...sharedProps}
      responsive={null}
      isMobile={isMobile}
    />
  );

  const versionNode = (
    <div key="version" className="version">
      <Select
        size="small"
        variant="filled"
        className={styles.versionSelect}
        value={packageInfo.version}
        options={versionOptions}
        disabled
        popupMatchSelectWidth={false}
        getPopupContainer={(trigger) => trigger.parentNode}
      />
    </div>
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

  const headerClassName = clsx(styles.header, 'clearfix', { 'home-header': isHome });

  const compactNavigationNode = React.cloneElement(navigationNode, {
    responsive,
  });

  let menu = [
    compactNavigationNode,
    versionNode,
    directionSwitch,
    <ThemeSwitch key="theme" />,
    githubNode,
  ].filter(Boolean);

  if (windowWidth < RESPONSIVE_XS) {
    menu = [compactNavigationNode];
  }

  const colProps = isHome
    ? [{ flex: 'none' }, { flex: 'auto' }]
    : [
        { xxl: 4, xl: 5, lg: 6, md: 6, sm: 24, xs: 24 },
        { xxl: 20, xl: 19, lg: 18, md: 18, sm: 0, xs: 0 },
      ];

  return (
    <header className={headerClassName}>
      {isMobile && (
        <Popover
          classNames={{ root: styles.popoverMenu }}
          placement="bottomRight"
          content={menu}
          trigger="click"
          open={menuVisible}
          arrow={{ pointAtCenter: true }}
          onOpenChange={(visible) =>
            setHeaderState((prev) => ({ ...prev, menuVisible: visible }))
          }
        >
          <MenuOutlined className="nav-phone-icon" />
        </Popover>
      )}
      <Row style={{ flexFlow: 'nowrap', height: 64 }}>
        <Col {...colProps[0]}>
          <Logo {...sharedProps} />
        </Col>
        <Col {...colProps[1]}>
          <div className={styles.menuRow}>
            <DumiSearchBar />
            {!isMobile && menu}
          </div>
        </Col>
      </Row>
    </header>
  );
};

export default Header;
