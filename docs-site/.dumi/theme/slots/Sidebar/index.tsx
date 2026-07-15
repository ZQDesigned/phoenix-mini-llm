import React from 'react';
import { Col, ConfigProvider, Menu } from 'antd';
import { createStyles, useTheme } from 'antd-style';

import useMenu from '../../../hooks/useMenu';
import SiteContext from '../SiteContext';

const useStyle = createStyles(({ css, cssVar, token }) => ({
  mainMenu: css`
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
  asideContainer: css`
    min-height: 100%;
    padding-bottom: ${cssVar.marginXXL}px !important;
    padding-inline: ${cssVar.paddingXXS}px;
    font-family: Avenir, AlibabaSans, ${cssVar.fontFamily}, sans-serif;

    &${token.antCls}-menu-inline > ${token.antCls}-menu-item-group > ${token.antCls}-menu-item-group-title {
      margin-top: ${cssVar.margin}px;
      margin-bottom: ${cssVar.margin}px;
      font-size: ${cssVar.fontSize}px;
      font-weight: 600;
      color: ${cssVar.colorTextSecondary};
    }

    &${token.antCls}-menu-inline > ${token.antCls}-menu-item,
    &${token.antCls}-menu-inline > ${token.antCls}-menu-item-group > ${token.antCls}-menu-item-group-list > ${token.antCls}-menu-item {
      padding-inline: 36px 12px !important;
    }
  `,
}));

const Sidebar: React.FC = () => {
  const { styles } = useStyle();
  const { isMobile, isDark } = React.useContext(SiteContext);
  const { colorBgContainer } = useTheme();
  const [menuItems, selectedKey] = useMenu();

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
        />
      </ConfigProvider>
    </Col>
  );
};

export default Sidebar;
