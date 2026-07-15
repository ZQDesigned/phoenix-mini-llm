import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme } from 'antd-style';

const HeadingAnchor: React.FC = () => {
  const token = useTheme();

  return (
    <Global
      styles={css`
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          > a[aria-hidden]:first-child {
            float: inline-start;
            width: 20px;
            margin-inline-start: -${token.marginLG}px;
            padding-inline-end: ${token.paddingXXS}px;
            font-size: 0;
            line-height: inherit;
            text-align: end;

            [data-direction='rtl'] & {
              float: inline-end;
            }

            &:hover {
              border: 0;
            }

            > .icon-link::before {
              content: '#';
              color: ${token.colorTextSecondary};
              font-size: ${token.fontSizeXL}px;
              font-family: ${token.codeFamily};
            }
          }

          &:not(:hover) > a[aria-hidden]:first-child > .icon-link {
            visibility: hidden;
          }
        }
      `}
    />
  );
};

export default HeadingAnchor;
