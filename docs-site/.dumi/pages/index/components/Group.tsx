import * as React from 'react';
import { Typography } from 'antd';
import { createStaticStyles, useTheme } from 'antd-style';
import { clsx } from 'clsx';

import SiteContext from '../../../theme/slots/SiteContext';

const styles = createStaticStyles(({ css, cssVar }) => ({
  box: css`
    position: relative;
    transition: all ${cssVar.motionDurationSlow};
    background-size: cover;
    background-position: 50% 0%;
    background-repeat: no-repeat;
  `,
  typographyWrapper: css`
    text-align: center;
  `,
  marginStyle: css`
    max-width: 1208px;
    margin-inline: auto;
    box-sizing: border-box;
    padding-inline: ${cssVar.marginXXL}px;
  `,
}));

export interface GroupProps {
  id?: string;
  title?: React.ReactNode;
  titleColor?: string;
  description?: React.ReactNode;
  background?: string;
  collapse?: boolean;
  decoration?: React.ReactNode;
}

const Group: React.FC<React.PropsWithChildren<GroupProps>> = ({
  id,
  title,
  titleColor,
  description,
  children,
  decoration,
  background,
  collapse,
}) => {
  const token = useTheme();
  const { isMobile } = React.useContext(SiteContext);

  return (
    <div
      style={
        background?.startsWith('https') || background?.startsWith('linear-gradient')
          ? {
              backgroundImage: background?.startsWith('linear-gradient')
                ? background
                : `url(${background})`,
            }
          : { backgroundColor: background }
      }
      className={styles.box}
    >
      {decoration}
      <div style={{ paddingBlock: token.marginFarSM }}>
        <div className={styles.typographyWrapper}>
          <Typography.Title
            id={id}
            level={1}
            style={{
              fontWeight: 900,
              color: titleColor,
              margin: 0,
              fontSize: isMobile ? token.fontSizeHeading2 : token.fontSizeHeading1,
            }}
          >
            {title}
          </Typography.Title>
          <Typography.Paragraph
            style={{
              color: titleColor,
              marginBottom: isMobile ? token.marginXXL : token.marginFarXS,
              marginTop: token.marginSM,
            }}
          >
            {description}
          </Typography.Paragraph>
        </div>
        <div className={clsx({ [styles.marginStyle]: !collapse })}>{children}</div>
      </div>
    </div>
  );
};

export default Group;
