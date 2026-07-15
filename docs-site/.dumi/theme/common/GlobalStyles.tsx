import React from 'react';
import { css, Global } from '@emotion/react';
import { updateCSS } from '@rc-component/util';
import { useTheme } from 'antd-style';

const GlobalStyles: React.FC = () => {
  const token = useTheme();

  React.useInsertionEffect(() => {
    updateCSS('@layer theme, base, global, antd, components, utilities;', 'phoenix-theme-layer', {
      prepend: true,
    });
  }, []);

  return (
    <Global
      styles={css`
        @layer base {
          html {
            scrollbar-width: thin;
            scrollbar-color: #d9d9d9 transparent;
          }

          html.rtl {
            direction: rtl;
          }

          body {
            overflow-x: hidden;
            color: ${token.colorText};
            font-size: ${token.fontSize}px;
            font-family: AlibabaSans, ${token.fontFamily};
            line-height: ${token.lineHeight};
            background: ${token.colorBgContainer};
            transition: background-color ${token.motionDurationSlow};
          }

          body,
          div,
          dl,
          dt,
          dd,
          ul,
          ol,
          li,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          pre,
          code,
          form,
          fieldset,
          legend,
          input,
          textarea,
          p,
          blockquote,
          th,
          td,
          hr,
          button,
          article,
          aside,
          details,
          figcaption,
          figure,
          footer,
          header,
          nav,
          section {
            margin: 0;
            padding: 0;
          }

          ul,
          ol {
            list-style: none;
          }

          img {
            vertical-align: middle;
            border-style: none;
          }

          [id] {
            scroll-margin-top: ${token.anchorTop}px;
          }
        }

        @layer global {
          .markdown {
            color: ${token.colorText};
            font-size: ${token.fontSize}px;
            line-height: 2;
          }

          .markdown h1 {
            margin-top: ${token.marginXS}px;
            margin-bottom: ${token.marginMD}px;
            color: ${token.colorTextHeading};
            font-weight: 500;
            font-size: 30px;
            font-family: Avenir, AlibabaSans, ${token.fontFamily}, sans-serif;
            line-height: 38px;
          }

          .markdown h2 {
            font-size: 24px;
            line-height: 32px;
          }

          .markdown h2,
          .markdown h3,
          .markdown h4,
          .markdown h5,
          .markdown h6 {
            clear: both;
            margin: 1.6em 0 0.6em;
            color: ${token.colorTextHeading};
            font-weight: 500;
            font-family: Avenir, AlibabaSans, ${token.fontFamily}, sans-serif;
          }

          .markdown h3 {
            font-size: 18px;
          }

          .markdown h4 {
            font-size: ${token.fontSizeLG}px;
          }

          .markdown p,
          .markdown pre {
            margin: 1em 0;
            text-align: start;
          }

          .markdown ul > li,
          .markdown ol > li {
            padding-inline-start: ${token.paddingXXS}px;
            margin-inline-start: ${token.marginMD}px;
          }

          .markdown ul > li {
            list-style-type: circle;
          }

          .markdown ol > li {
            list-style-type: decimal;
          }

          .markdown a {
            color: ${token.colorPrimary};
          }

          .markdown code {
            margin: 0 1px;
            padding: 0.2em 0.4em;
            font-size: 0.9em;
            background: ${token.siteMarkdownCodeBg};
            border: 1px solid ${token.colorSplit};
            border-radius: ${token.borderRadiusSM}px;
          }

          .markdown pre {
            overflow: auto;
            font-family: ${token.codeFamily};
            background: ${token.siteMarkdownCodeBg};
            border-radius: ${token.borderRadius}px;
          }

          .markdown pre code {
            margin: 0;
            padding: ${token.paddingSM}px ${token.paddingMD}px;
            display: block;
            font-size: ${Math.max(token.fontSize - 1, 12)}px;
            line-height: 1.8;
            background: transparent;
            border: none;
          }

          .markdown blockquote {
            margin: 1em 0;
            padding-inline-start: 0.8em;
            color: ${token.colorTextSecondary};
            font-size: 90%;
            border-inline-start: 4px solid ${token.colorSplit};
          }

          .markdown blockquote p {
            margin: 0;
          }

          .markdown table {
            width: 100%;
            margin: ${token.marginLG}px 0;
            border-collapse: collapse;
            border-spacing: 0;
          }

          .markdown table th,
          .markdown table td {
            padding: ${token.paddingSM}px ${token.padding}px;
            border: 1px solid ${token.colorSplit};
            text-align: start;
          }

          .markdown table th {
            background: ${token.colorFillAlter};
            font-weight: 600;
          }

          .markdown hr {
            clear: both;
            height: 1px;
            margin: ${token.marginLG}px 0;
            background: ${token.colorSplit};
            border: 0;
          }

          .dumi-default-search-bar {
            display: inline-flex;
            align-items: center;
            flex: auto;
            max-width: 220px;
            height: 32px;
            margin: 0;
            margin-inline-end: 16px !important;
            background: ${token.colorBgContainer};
            border-radius: ${token.borderRadiusSM}px;
            transition: background ${token.motionDurationSlow};
          }

          .dumi-default-search-bar > svg {
            width: 14px;
            fill: ${token.colorTextPlaceholder};
            flex-shrink: 0;
            margin-inline-start: -6px;
          }

          .dumi-default-search-bar > input {
            flex: 1;
            min-width: 0;
            height: 100%;
            border: 0;
            background: transparent;
            padding-inline-start: 32px;
            color: ${token.colorText};
          }

          .dumi-default-search-bar > input:focus {
            box-shadow: none;
            background: transparent;
          }

          .dumi-default-search-bar > input::placeholder {
            color: ${token.colorTextPlaceholder};
          }

          .dumi-default-search-bar:hover,
          .dumi-default-search-bar:focus-within {
            background: ${token.colorFillSecondary};
          }

          .dumi-default-search-shortcut {
            display: none;
          }

          .dumi-default-search-popover {
            background: ${token.colorBgElevated} !important;
          }

          .dumi-default-search-popover::before {
            border-bottom-color: ${token.colorBgElevated} !important;
          }

          .dumi-default-search-popover section,
          .dumi-default-search-result dl {
            scrollbar-width: thin;
            scrollbar-gutter: stable;
          }

          .dumi-default-search-result dl dt {
            background: ${token.controlItemBgActive} !important;
          }

          .dumi-default-search-result dl dd a:hover {
            background: ${token.controlItemBgHover};
          }

          .dumi-default-search-result dl dd a:hover h4,
          .dumi-default-search-result dl dd a:hover p {
            color: ${token.colorText} !important;
          }

          .dumi-default-search-result dl dd a:hover svg {
            fill: ${token.colorText} !important;
          }

          @media only screen and (max-width: ${token.mobileMaxWidth}px) {
            .toc {
              display: none;
            }

            .phoenix-sidebar-layout {
              display: block !important;
            }

            .phoenix-content-shell {
              width: 100%;
              min-width: 0;
            }
          }
        }
      `}
    />
  );
};

export default GlobalStyles;
