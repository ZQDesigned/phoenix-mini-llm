import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme } from 'antd-style';

const Responsive: React.FC = () => {
  const token = useTheme();

  return (
    <Global
      styles={css`
        .nav-phone-icon {
          position: absolute;
          inset-inline-end: 30px;
          bottom: 17px;
          z-index: 1;
          display: none;
          width: 16px;
          height: 22px;
          cursor: pointer;
        }

        @media only screen and (max-width: 767.99px) {
          .toc {
            display: none;
          }

          .nav-phone-icon {
            display: block;
          }

          .phoenix-content-shell {
            display: block;
          }

          .phoenix-sidebar-layout {
            margin-top: ${token.margin}px;
          }

          .phoenix-track-grid {
            grid-template-columns: 1fr;
          }
        }
      `}
    />
  );
};

export default Responsive;
