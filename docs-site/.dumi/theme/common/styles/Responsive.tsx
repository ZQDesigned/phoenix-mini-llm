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
          bottom: 17px;
          inset-inline-end: 30px;
          z-index: 1;
          display: none;
          width: 16px;
          height: 22px;
          cursor: pointer;
        }

        @media only screen and (max-width: 767.99px) {
          .preview-image-boxes {
            float: none;
            width: 100%;
            margin: 0 !important;
          }

          .preview-image-box {
            width: 100%;
            margin: 10px 0;
            padding: 0;
          }

          div.version {
            display: block;
            margin: 29px auto 16px;
          }

          .toc {
            display: none;
          }

          .nav-phone-icon {
            display: block;
          }

          .phoenix-content-shell {
            display: block;
          }

          .main {
            height: calc(100% - 86px);
          }

          .aside-container {
            float: none;
            width: auto;
            padding-bottom: 30px;
            border-inline-end: 0;
          }

          .main-wrapper {
            width: 100%;
            margin: 0;
            border-radius: 0;
          }

          .prev-next-nav {
            width: calc(100% - 32px);
            margin-inline-start: ${token.margin}px;
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
