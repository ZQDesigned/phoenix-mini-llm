import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme } from 'antd-style';

const Demo: React.FC = () => {
  const token = useTheme();
  const { antCls, iconCls } = token;

  return (
    <Global
      styles={css`
        .code-boxes-col-1-1 {
          width: 100%;
        }

        .code-boxes-col-2-1 {
          display: inline-block;
          vertical-align: top;
        }

        .code-box {
          position: relative;
          display: inline-block;
          width: calc(100% - ${token.lineWidth * 2}px);
          margin: 0 0 ${token.margin}px;
          background-color: ${token.colorBgContainer};
          border: 1px solid ${token.colorSplit};
          border-radius: ${token.borderRadiusLG}px;
          transition: all ${token.motionDurationMid};

          &.code-box-simplify {
            margin-bottom: 0;
            border-radius: 0;

            .code-box-demo {
              padding: 0;
              border-bottom: 0;
            }
          }

          .code-box-title {
            &,
            a {
              color: ${token.colorText} !important;
              background: ${token.colorBgContainer};
            }
          }

          .code-box-demo {
            background-color: ${token.colorBgContainer};
            border-radius: ${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0;

            > .demo {
              overflow: auto;
            }
          }

          .markdown {
            pre {
              margin: 0.5em 0;
              padding: 6px 12px;
            }

            pre code {
              margin: 0;
              background: #f5f5f5;
            }
          }

          &:target {
            border: 1px solid ${token.colorPrimary};
          }

          &-title {
            position: absolute;
            top: -14px;
            margin-inline-start: ${token.margin}px;
            padding: 1px 8px;
            color: #777;
            background: ${token.colorBgContainer};
            border-radius: ${token.borderRadius}px ${token.borderRadius}px 0 0;
            transition: background-color 0.4s;

            a,
            a:hover {
              color: ${token.colorText};
              font-weight: 500;
              font-size: ${token.fontSize}px;
            }
          }

          &-description {
            padding: 18px 24px 12px;
          }

          a.edit-button {
            position: absolute;
            top: 7px;
            inset-inline-end: -16px;
            padding-inline-end: ${token.paddingXXS}px;
            font-size: ${token.fontSizeSM}px;
            text-decoration: none;
            background: inherit;
            transform: scale(0.9);

            ${iconCls} {
              color: ${token.colorTextSecondary};
              transition: all ${token.motionDurationSlow};

              &:hover {
                color: ${token.colorText};
              }
            }

            ${antCls}-row${antCls}-row-rtl & {
              inset-inline-end: auto;
              inset-inline-start: -22px;
            }
          }

          &-demo {
            padding: 42px 24px 50px;
            color: ${token.colorText};
            border-bottom: 1px solid ${token.colorSplit};
          }

          iframe {
            width: 100%;
            border: 0;
          }

          &-meta {
            &.markdown {
              position: relative;
              width: 100%;
              font-size: ${token.fontSize}px;
              border-radius: 0 0 ${token.borderRadius}px ${token.borderRadius}px;
              transition: background-color 0.4s;
            }

            blockquote {
              line-height: 1.5;
            }

            h4,
            section& p {
              margin: 0;
            }

            > p {
              width: 100%;
              margin: 0.5em 0;
              padding-inline-end: 25px;
              font-size: ${token.fontSizeSM}px;
              word-break: break-word;
            }
          }

          &.expand &-meta {
            border-bottom: 1px dashed ${token.colorSplit};
            border-radius: 0;
          }

          .code-expand-icon {
            position: relative;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }

          .highlight-wrapper {
            display: none;
            border-radius: 0 0 ${token.borderRadius}px ${token.borderRadius}px;

            &-expand {
              display: block;
            }
          }

          .highlight {
            position: relative;

            pre {
              margin: 0;
              padding: 0;
              background: ${token.colorBgContainer};
            }

            &:not(:first-child) {
              border-top: 1px dashed ${token.colorSplit};
            }
          }

          &-actions {
            display: flex;
            justify-content: center;
            padding: ${token.paddingSM}px 0;
            border-top: 1px dashed ${token.colorSplit};
            opacity: 0.7;
            transition: opacity ${token.motionDurationSlow};

            &:hover {
              opacity: 1;
            }
          }

          &-actions &-code-action {
            position: relative;
            display: flex;
            align-items: center;
            width: 16px;
            height: 16px;
            color: ${token.colorTextSecondary};
            cursor: pointer;
            transition: all 0.24s;

            &:hover {
              color: ${token.colorText};
            }

            ${iconCls} {
              display: block;
            }
          }
        }
      `}
    />
  );
};

export default Demo;
