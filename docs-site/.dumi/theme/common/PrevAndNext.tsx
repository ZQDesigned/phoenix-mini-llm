import type { ReactElement } from 'react';
import React, { useMemo } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { GetProp, MenuProps } from 'antd';
import { createStyles } from 'antd-style';
import { clsx } from 'clsx';

import useMenu from '../../hooks/useMenu';
import SiteContext from '../slots/SiteContext';

type MenuItemType = Extract<GetProp<MenuProps, 'items'>[number], { type?: 'item' }>;

const useStyle = createStyles(({ css, cssVar, token }) => ({
  prevNextNav: css`
    width: calc(100% - 234px);
    margin-inline-start: 64px;
    margin-inline-end: 170px;
    overflow: hidden;
    display: flex;
    border-top: 1px solid ${cssVar.colorSplit};
  `,
  pageNav: css`
    flex: 1;
    height: 72px;
    line-height: 72px;
    text-decoration: none;

    ${token.iconCls} {
      color: ${cssVar.colorTextSecondary};
      font-size: ${cssVar.fontSizeIcon};
      transition: all ${cssVar.motionDurationSlow};
    }
  `,
  prevNav: css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: start;

    .footer-nav-icon-after {
      display: none;
    }

    .footer-nav-icon-before {
      position: relative;
      margin-inline-end: 1em;
      transition: inset-inline-end ${cssVar.motionDurationSlow};
      inset-inline-end: 0;
    }

    &:hover .footer-nav-icon-before {
      inset-inline-end: 0.2em;
    }
  `,
  nextNav: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: end;

    .footer-nav-icon-before {
      display: none;
    }

    .footer-nav-icon-after {
      position: relative;
      margin-inline-start: 1em;
      transition: inset-inline-start ${cssVar.motionDurationSlow};
      inset-inline-start: 0;
    }

    &:hover .footer-nav-icon-after {
      inset-inline-start: 0.2em;
    }
  `,
}));

const flattenMenu = (menuItems: MenuProps['items']): MenuProps['items'] | null => {
  if (!Array.isArray(menuItems)) {
    return null;
  }

  return menuItems.reduce<Exclude<MenuProps['items'], undefined>>((acc, item) => {
    if (!item) {
      return acc;
    }

    if ('children' in item && item.children) {
      return acc.concat(flattenMenu(item.children) ?? []);
    }

    return acc.concat(item);
  }, []);
};

const PrevAndNext: React.FC = () => {
  const { styles } = useStyle();
  const { isMobile, direction } = React.useContext(SiteContext);
  const [menuItems, selectedKey] = useMenu();

  const before = direction === 'rtl'
    ? <RightOutlined className="footer-nav-icon-before" />
    : <LeftOutlined className="footer-nav-icon-before" />;
  const after = direction === 'rtl'
    ? <LeftOutlined className="footer-nav-icon-after" />
    : <RightOutlined className="footer-nav-icon-after" />;

  const [prev, next] = useMemo(() => {
    const flatMenu = flattenMenu(menuItems);

    if (!flatMenu) {
      return [null, null];
    }

    const activeIndex = flatMenu.findIndex((item) => item && item.key === selectedKey);

    return [
      flatMenu[activeIndex - 1] as MenuItemType | null,
      flatMenu[activeIndex + 1] as MenuItemType | null,
    ];
  }, [menuItems, selectedKey]);

  if (isMobile || (!prev && !next)) {
    return null;
  }

  return (
    <section className={styles.prevNextNav}>
      {prev &&
        React.cloneElement(prev.label as ReactElement<{ className?: string }>, {
          children: (
            <>
              {before}
              {(prev.label as ReactElement).props.children}
            </>
          ),
          className: clsx(styles.pageNav, styles.prevNav),
        })}
      {next &&
        React.cloneElement(next.label as ReactElement<{ className?: string }>, {
          children: (
            <>
              {(next.label as ReactElement).props.children}
              {after}
            </>
          ),
          className: clsx(styles.pageNav, styles.nextNav),
        })}
    </section>
  );
};

export default PrevAndNext;
