import type { MouseEvent, MouseEventHandler } from 'react';
import React, { useMemo } from 'react';
import { Link as DumiLink, useAppData, useLocation, useNavigate } from 'dumi';

export interface LinkProps {
  to: string | { pathname?: string; search?: string; hash?: string };
  style?: React.CSSProperties;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  component?: React.ComponentType<any>;
  ref?: React.Ref<HTMLAnchorElement>;
}

const Link = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  (props, forwardedRef) => {
    const { component, children, to, ref: legacyRef, ...rest } = props;
    const { pathname } = useLocation();
    const { preloadRoute } = useAppData();
    const navigate = useNavigate();

    const href = useMemo<string>(() => {
      if (typeof to === 'object') {
        return `${to.pathname || pathname}${to.search || ''}${to.hash || ''}`;
      }

      return to;
    }, [pathname, to]);

    const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
      rest.onClick?.(event);

      if (!href.startsWith('http') && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        navigate(href);
      }
    };

    const mergedRef = legacyRef ?? forwardedRef;

    if (component) {
      return React.createElement(
        component,
        {
          ...rest,
          ref: mergedRef,
          href,
          onClick,
          onMouseEnter: () => preloadRoute?.(href),
        },
        children,
      );
    }

    return (
      <DumiLink ref={mergedRef} {...rest} to={href} prefetch>
        {children}
      </DumiLink>
    );
  },
);

Link.displayName = 'Link';

export default Link;
