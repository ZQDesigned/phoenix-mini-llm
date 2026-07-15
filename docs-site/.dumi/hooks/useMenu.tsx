import React, { useMemo } from 'react';
import type { MenuProps, TagProps } from 'antd';
import { Flex, Tag, version } from 'antd';
import { createStaticStyles } from 'antd-style';
import { clsx } from 'clsx';
import { useSidebarData } from 'dumi';

import useLocale from './useLocale';
import useLocation from './useLocation';
import Link from '../theme/common/Link';

const locales = {
  cn: {
    deprecated: '废弃',
    updated: '更新',
    new: '新增',
  },
  en: {
    deprecated: 'DEPRECATED',
    updated: 'UPDATED',
    new: 'NEW',
  },
};

const getTagColor = (value?: string): TagProps['color'] => {
  switch (value?.toUpperCase()) {
    case 'UPDATED':
      return 'processing';
    case 'DEPRECATED':
      return 'red';
    default:
      return 'success';
  }
};

const styles = createStaticStyles(({ css, cssVar }) => ({
  link: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `,
  tag: css`
    margin-inline-end: 0;
  `,
  subtitle: css`
    margin-inline-start: ${cssVar.marginSM};
    font-size: ${cssVar.fontSizeSM};
    font-weight: normal;
    opacity: 0.8;
  `,
}));

interface MenuItemLabelProps {
  before?: React.ReactNode;
  after?: React.ReactNode;
  link: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  search?: string;
  tag?: string;
  className?: string;
}

const MenuItemLabelWithTag: React.FC<MenuItemLabelProps> = ({
  before,
  after,
  link,
  title,
  subtitle,
  search,
  tag,
  className,
}) => {
  const [locale] = useLocale<string>(locales);

  const getLocale = (name: string) => locale[name.toLowerCase()] ?? name;

  if (!before && !after) {
    return (
      <Link to={`${link}${search || ''}`} className={clsx(className, { [styles.link]: tag })}>
        <Flex justify="flex-start" align="center">
          {title && <span>{title}</span>}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </Flex>
        {tag && (
          <Tag variant="filled" className={styles.tag} color={getTagColor(tag)}>
            {getLocale(tag.replace(/VERSION/i, version))}
          </Tag>
        )}
      </Link>
    );
  }

  return (
    <Link to={`${link}${search || ''}`} className={className}>
      {before}
      {title}
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      {after}
    </Link>
  );
};

export interface UseMenuOptions {
  before?: React.ReactNode;
  after?: React.ReactNode;
}

const normalizePath = (path: string) => {
  const normalized = path.replace(/\/$/, '');
  return normalized || '/';
};

const useMenu = (options: UseMenuOptions = {}): readonly [MenuProps['items'], string] => {
  const sidebarData = useSidebarData();
  const { pathname, search } = useLocation();
  const { before, after } = options;

  const menuItems = useMemo<Exclude<MenuProps['items'], undefined>>(
    () =>
      (sidebarData ?? []).reduce<Exclude<MenuProps['items'], undefined>>((result, group) => {
        if (group?.title) {
          result.push({
            type: 'group',
            label: group.title,
            key: group.title,
            children:
              group.children?.map((item) => ({
                label: (
                  <MenuItemLabelWithTag
                    before={before}
                    after={after}
                    link={item.link}
                    title={item.title}
                    subtitle={item.frontmatter?.subtitle}
                    search={search}
                    tag={item.frontmatter?.tag}
                  />
                ),
                key: normalizePath(item.link),
              })) ?? [],
          });
        } else {
          result.push(
            ...(group.children ?? []).map((item) => ({
              label: (
                <MenuItemLabelWithTag
                  before={before}
                  after={after}
                  link={item.link}
                  title={item.title}
                  search={search}
                  tag={item.frontmatter?.tag}
                />
              ),
              key: normalizePath(item.link),
            })),
          );
        }

        return result;
      }, []),
    [after, before, search, sidebarData],
  );

  return [menuItems, normalizePath(pathname)] as const;
};

export default useMenu;
