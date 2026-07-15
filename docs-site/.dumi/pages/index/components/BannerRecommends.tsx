import React from 'react';
import { raf } from '@rc-component/util';
import { Badge, Carousel, Flex, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { clsx } from 'clsx';

import Link from '../../../theme/common/Link';
import SiteContext from '../../../theme/slots/SiteContext';

interface RecommendItemData {
  title: string;
  description: string;
  footer: string;
  href: string;
  badge?: string;
  label: string;
}

const recommendItems: RecommendItemData[] = [
  {
    title: '学习主线',
    description: '顺着 12 章知识档案，从问题定义、张量、Tokenizer 一路学到训练工程与采样。',
    footer: '12 章顺序阅读',
    href: '/learning',
    badge: 'HOT',
    label: 'LEARN',
  },
  {
    title: '复刻教程',
    description: '不是运行现成仓库，而是从空目录一步一步搭出与当前项目同构的小型语言模型工程。',
    footer: '10 个阶段',
    href: '/tutorials',
    label: 'BUILD',
  },
  {
    title: '踩坑记录',
    description: '把真实开发里踩过的环境、路径、设备和部署问题按顺序摊开，方便快速对照。',
    footer: '按时间线回顾',
    href: '/pitfalls',
    label: 'DEBUG',
  },
];

const useStyle = createStyles(({ cssVar, css, cx, token }) => {
  const itemBase = css`
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    align-items: stretch;
    min-height: 178px;
    box-sizing: border-box;
    padding-block: ${cssVar.paddingMD};
    padding-inline: ${cssVar.paddingLG};
    text-decoration: none;
    position: relative;
    border: ${cssVar.lineWidth}px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG}px;
    background: ${cssVar.colorBgContainer};
    background: color-mix(in srgb, ${cssVar.colorBgContainer} 30%, transparent);
    backdrop-filter: blur(8px);
    transition: all ${cssVar.motionDurationSlow};

    &::before {
      content: '';
      position: absolute;
      inset: calc(${cssVar.lineWidth}px * -1);
      padding: 1px;
      border-radius: inherit;
      opacity: 0;
      transition: all 0.3s ease;
      background: radial-gradient(
        circle 150px at var(--mouse-x, 0) var(--mouse-y, 0),
        ${cssVar.colorPrimaryBorderHover},
        ${cssVar.colorBorderSecondary}
      );
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask-composite: subtract;
      -webkit-mask-composite: xor;
    }

    &:hover {
      backdrop-filter: blur(0);
      background: color-mix(in srgb, ${cssVar.colorBgContainer} 90%, transparent);

      &::before {
        opacity: 1;
      }
    }

    h5 {
      margin-bottom: ${cssVar.marginSM}px;
    }

    p {
      flex: auto;
      margin-bottom: ${cssVar.marginLG}px;
      color: ${cssVar.colorTextSecondary} !important;
    }
  `;

  return {
    itemBase,
    ribbon: css`
      & > .${cx(itemBase)} {
        height: 100%;
      }
    `,
    sliderItem: css`
      margin: 0 ${cssVar.margin}px;
      text-align: start;
    `,
    container: css`
      display: flex;
      width: 100%;
      max-width: 1200px;
      margin-inline: auto;
      align-items: stretch;
      text-align: start;
      column-gap: calc(${cssVar.paddingMD} * 2);

      > * {
        width: calc((100% - calc(${cssVar.marginXXL} * 2)) / 3);
      }
    `,
    footer: css`
      color: ${cssVar.colorTextSecondary};
      font-size: ${cssVar.fontSize}px;
    `,
    label: css`
      color: ${token.colorPrimary};
      font-size: ${cssVar.fontSizeSM}px;
      font-weight: 700;
      letter-spacing: 0.12em;
    `,
    carousel: css`
      width: calc(100% - ${cssVar.marginLG}px * 2);

      .slick-list {
        overflow: visible;
      }

      .slick-dots {
        bottom: -32px;
      }
    `,
  };
});

interface RecommendItemProps {
  item: RecommendItemData;
  index: number;
  className?: string;
}

const RecommendItem: React.FC<RecommendItemProps> = ({ item, index, className }) => {
  const { styles } = useStyle();
  const [mousePosition, setMousePosition] = React.useState<[number, number]>([0, 0]);
  const [transMousePosition, setTransMousePosition] = React.useState<[number, number]>([0, 0]);

  const onMouseMove: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMousePosition([x, y]);
  };

  React.useEffect(() => {
    const [targetX, targetY] = mousePosition;
    const [currentX, currentY] = transMousePosition;

    if (Math.abs(targetX - currentX) < 0.5 && Math.abs(targetY - currentY) < 0.5) {
      return;
    }

    const rafId = raf(() => {
      setTransMousePosition((origin) => {
        const [curX, curY] = origin;
        return [curX + (targetX - curX) * 0.1, curY + (targetY - curY) * 0.1];
      });
    });

    return () => raf.cancel(rafId);
  }, [mousePosition, transMousePosition]);

  const card = (
    <Link
      to={item.href}
      className={clsx(styles.itemBase, className)}
      style={
        {
          '--mouse-x': `${transMousePosition[0]}px`,
          '--mouse-y': `${transMousePosition[1]}px`,
        } as React.CSSProperties
      }
      onMouseMove={onMouseMove}
    >
      <Typography.Title level={5}>{item.title}</Typography.Title>
      <Typography.Paragraph>{item.description}</Typography.Paragraph>
      <Flex justify="space-between" align="center">
        <Typography.Text className={styles.footer}>{item.footer}</Typography.Text>
        <span className={styles.label}>{item.label}</span>
      </Flex>
    </Link>
  );

  if (index === 0 && item.badge) {
    return (
      <Badge.Ribbon text={item.badge} color="red" rootClassName={styles.ribbon}>
        {card}
      </Badge.Ribbon>
    );
  }

  return card;
};

const BannerRecommends: React.FC = () => {
  const { styles } = useStyle();
  const { isMobile } = React.useContext(SiteContext);

  if (isMobile) {
    return (
      <Carousel className={styles.carousel}>
        {recommendItems.map((item, index) => (
          <div key={item.href}>
            <RecommendItem item={item} index={index} className={styles.sliderItem} />
          </div>
        ))}
      </Carousel>
    );
  }

  return (
    <div className={styles.container}>
      {recommendItems.map((item, index) => (
        <RecommendItem key={item.href} item={item} index={index} />
      ))}
    </div>
  );
};

export default BannerRecommends;
