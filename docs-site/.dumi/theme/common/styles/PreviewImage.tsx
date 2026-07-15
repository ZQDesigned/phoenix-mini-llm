import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme } from 'antd-style';

const PreviewImage: React.FC = () => {
  const token = useTheme();

  return (
    <Global
      styles={css`
        .preview-image-boxes {
          display: flex;
          float: inline-end;
          clear: both;
          width: 496px;
          margin: 0 0 70px 64px;

          &-with-carousel {
            width: 420px;

            .preview-image-box img {
              padding: 0;
            }
          }

          .ant-row-rtl & {
            float: inline-start;
            margin: 0 64px 70px 0;
          }
        }

        .preview-image-boxes + .preview-image-boxes {
          margin-top: -35px;
        }

        .preview-image-box {
          float: inline-start;
          width: 100%;
        }

        .preview-image-box + .preview-image-box {
          margin-inline-start: ${token.marginLG}px;

          .ant-row-rtl & {
            margin-inline-end: ${token.marginLG}px;
            margin-inline-start: 0;
          }
        }

        .preview-image-wrapper {
          position: relative;
          display: inline-block;
          width: 100%;
          padding: ${token.padding}px;
          text-align: center;
          background: #f2f4f5;
          box-sizing: border-box;
        }

        .preview-image-wrapper.video {
          display: block;
          padding: 0;
          background: 0;
        }

        .preview-image-wrapper video {
          display: block;
          width: 100%;

          + svg {
            position: absolute;
            top: 0;
            inset-inline-start: 0;
          }
        }

        .preview-image-wrapper.good::after,
        .preview-image-wrapper.bad::after {
          position: absolute;
          bottom: 0;
          inset-inline-start: 0;
          display: block;
          width: 100%;
          height: 3px;
          content: '';
        }

        .preview-image-wrapper.good::after {
          background: ${token.colorPrimary};
        }

        .preview-image-wrapper.bad::after {
          background: ${token.colorError};
        }

        .preview-image-title {
          margin-top: ${token.marginMD}px;
          color: ${token.colorText};
          font-size: ${token.fontSizeSM}px;
        }

        .preview-image-description {
          margin-top: 2px;
          color: ${token.colorTextSecondary};
          font-size: ${token.fontSizeSM}px;
          line-height: 1.5;
        }

        .preview-image-description hr {
          margin: 2px 0;
          background: none;
          border: 0;
        }

        .preview-image-box img {
          box-sizing: border-box;
          max-width: 100%;
          padding: ${token.paddingSM}px;
          background: ${token.colorBgContainer};
          border-radius: ${token.borderRadius}px;
          cursor: pointer;
          transition: all ${token.motionDurationSlow};

          &.no-padding {
            padding: 0;
            background: none;
          }
        }

        .preview-image-boxes.preview-image-boxes-with-carousel img {
          padding: 0;
          box-shadow:
            0 1px 0 0 #ddd,
            0 3px 0 0 ${token.colorBgContainer},
            0 4px 0 0 #ddd,
            0 6px 0 0 ${token.colorBgContainer},
            0 7px 0 0 #ddd;
        }

        .preview-image-box img:hover {
          box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
        }
      `}
    />
  );
};

export default PreviewImage;
