import React, { useEffect } from 'react';
import { Col, ConfigProvider, Menu } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { useSidebarData } from 'dumi';

import useMenu from '../../../hooks/useMenu';
import SiteContext from '../SiteContext';

const useStyle = createStyles(({ css, cssVar, token }) => ({
  asideContainer: css`
    min-height: 100%;
    padding-top: 0;
    padding-bottom: ${cssVar.marginXXL}px !important;
    padding-inline: ${cssVar.paddingXXS}px;
    font-family: Avenir, ${cssVar.fontFamily}, sans-serif;

    &${token.antCls}-menu-inline {
      ${token.antCls}-menu-submenu-title h4,
      > ${token.antCls}-menu-item,
      ${token.antCls}-menu-item a {
        overflow: hidden;
        font-size: ${cssVar.fontSize}px;
        text-overflow: ellipsis;
      }

      > ${token.antCls}-menu-item-group > ${token.antCls}-menu-item-group-title {
        margin-top: ${cssVar.margin}px;
        margin-bottom: ${cssVar.margin}px;
        font-size: ${cssVar.fontSize}px;
        font-weight: 600;
        color: ${cssVar.colorTextSecondary};

        &::after {
          position: relative;
          top: 12px;
          display: block;
          width: calc(100% - 20px);
          height: 1px;
          content: '';
          background: ${cssVar.colorSplit};
        }
      }

      > ${token.antCls}-menu-item,
      > ${token.antCls}-menu-submenu > ${token.antCls}-menu-submenu-title,
      > ${token.antCls}-menu-item-group > ${token.antCls}-menu-item-group-title,
      > ${token.antCls}-menu-item-group > ${token.antCls}-menu-item-group-list > ${token.antCls}-menu-item,
      &${token.antCls}-menu-inline > ${token.antCls}-menu-item-group > ${token.antCls}-menu-item-group-list > ${token.antCls}-menu-item {
        padding-inline: 36px 12px !important;
      }

      ${token.antCls}-menu-item-group:first-child {
        ${token.antCls}-menu-item-group-title {
          margin-top: 0;
        }
      }
    }

    a[disabled] {
      color: #ccc;
    }
  `,
  mainMenu: css`
    z-index: 1;
    position: sticky;
    top: ${token.headerHeight}px;
    width: 100%;
    max-height: calc(100vh - ${token.headerHeight}px);
    overflow: hidden;
    scrollbar-width: thin;
    scrollbar-gutter: stable;
    &:hover {
      overflow-y: auto;
    }
  `,
}));

const Sidebar: React.FC = () => {
  const sidebarData = useSidebarData();
  const { styles } = useStyle();
  const { isMobile, isDark } = React.useContext(SiteContext);
  const { colorBgContainer } = useTheme();
  const [menuItems, selectedKey] = useMenu();
  const defaultOpenKeys = sidebarData?.map(({ title }) => title!).filter(Boolean) || [];
  const [openKeys, setOpenKeys] = React.useState<string[]>(defaultOpenKeys);
  const openKeySignature = openKeys.join(',');
  const defaultOpenKeySignature = defaultOpenKeys.join(',');

  useEffect(() => {
    if (openKeySignature === defaultOpenKeySignature) {
      return;
    }

    setOpenKeys(defaultOpenKeys);
  }, [defaultOpenKeys, defaultOpenKeySignature, openKeySignature]);

  if (isMobile || !menuItems?.length) {
    return null;
  }

  return (
    <Col xxl={4} xl={5} lg={6} md={6} sm={24} xs={24} className={styles.mainMenu}>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBg: colorBgContainer,
              darkItemBg: colorBgContainer,
            },
          },
        }}
      >
        <Menu
          items={menuItems}
          mode="inline"
          inlineIndent={30}
          className={styles.asideContainer}
          theme={isDark ? 'dark' : 'light'}
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
        />
      </ConfigProvider>
    </Col>
  );
};

export default Sidebar;
