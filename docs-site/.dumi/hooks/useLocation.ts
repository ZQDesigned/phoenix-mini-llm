import * as React from 'react';
import { useLocation as useDumiLocation } from 'dumi';

function clearPath(path: string) {
  const normalized = path.replace(/\/$/, '');
  return normalized || '/';
}

export default function useLocation() {
  const location = useDumiLocation();
  const { search } = location;

  const getLink = React.useCallback(
    (path: string, hash?: string | { cn: string; en: string }) => {
      let pathname = clearPath(path);

      if (search) {
        pathname = `${pathname}${search}`;
      }

      if (hash) {
        pathname = `${pathname}#${typeof hash === 'object' ? hash.cn : hash}`;
      }

      return pathname;
    },
    [search],
  );

  return {
    ...location,
    pathname: clearPath(location.pathname),
    getLink,
  };
}
