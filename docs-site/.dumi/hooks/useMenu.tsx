import React, { useMemo } from 'react';
import type { MenuProps } from 'antd';
import { useLocation, useSidebarData } from 'dumi';

import Link from '../theme/common/Link';

type SidebarGroup = NonNullable<ReturnType<typeof useSidebarData>>[number];

const normalizePath = (path: string) => {
  const normalized = path.replace(/\/$/, '');
  return normalized || '/';
};

const makeItemLabel = (item: SidebarGroup['children'][number], search: string) => {
  return (
    <Link to={`${item.link}${search}`}>
      {item.title}
    </Link>
  );
};

const useMenu = (): readonly [MenuProps['items'], string] => {
  const sidebarData = useSidebarData();
  const { pathname, search } = useLocation();

  const menuItems = useMemo<Exclude<MenuProps['items'], undefined>>(() => {
    const groups = sidebarData ?? [];

    return groups.reduce<Exclude<MenuProps['items'], undefined>>((result, group) => {
      const children = group.children?.map((item) => ({
        key: normalizePath(item.link),
        label: makeItemLabel(item, search),
      }));

      if (!children?.length) {
        return result;
      }

      if (group.title) {
        result.push({
          type: 'group',
          key: group.title,
          label: group.title,
          children,
        });
      } else {
        result.push(...children);
      }

      return result;
    }, []);
  }, [search, sidebarData]);

  return [menuItems, normalizePath(pathname)] as const;
};

export default useMenu;
