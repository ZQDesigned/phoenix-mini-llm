import React from 'react';
import { useEvent } from '@rc-component/util';
import { createStyles } from 'antd-style';

interface BubbleProps {
  size: number | string;
  left?: number | string;
  top?: number | string;
  color: string;
  offsetXMultiple?: number;
  offsetYMultiple?: number;
  defaultOpacity?: number;
}

const MAX_OFFSET = 200;

const Bubble: React.FC<BubbleProps> = ({
  size,
  left,
  top,
  color,
  offsetXMultiple = 1,
  offsetYMultiple = 1,
  defaultOpacity = 0.1,
}) => {
  const [offset, setOffset] = React.useState<[number, number]>([0, 0]);
  const [opacity, setOpacity] = React.useState(defaultOpacity);
  const [sizeOffset, setSizeOffset] = React.useState(1);

  const randomPosition = useEvent(() => {
    const baseOffsetX = (Math.random() - 0.5) * MAX_OFFSET * 2 * offsetXMultiple;
    const baseOffsetY = (Math.random() - 0.5) * MAX_OFFSET * 2 * offsetYMultiple;

    setOffset([baseOffsetX, baseOffsetY]);
    setOpacity(0.1 + Math.random() * 0.08);
    setSizeOffset(1 + Math.random() * 0.8);
  });

  React.useEffect(() => {
    randomPosition();
  }, [randomPosition]);

  React.useEffect(() => {
    const timeout = window.setTimeout(randomPosition, Math.random() * 2000 + 3000);

    return () => window.clearTimeout(timeout);
  }, [offset, randomPosition]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        opacity,
        borderRadius: '50%',
        background: color,
        filter: 'blur(100px)',
        transform: `translate(-50%, -50%) translate(${offset[0]}px, ${offset[1]}px) scale(${sizeOffset})`,
        transition: 'all 5s ease-in-out',
      }}
    />
  );
};

const useStyle = createStyles(({ css, cssVar }) => ({
  container: css`
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: ${cssVar.colorBgContainer};
  `,
}));

export interface LuminousBgProps {
  className?: string;
}

const LuminousBg: React.FC<LuminousBgProps> = ({ className }) => {
  const { styles, cx } = useStyle();

  return (
    <div className={cx(styles.container, className)}>
      <Bubble size={300} color="#ee35f1" left="0vw" top="0vh" offsetXMultiple={2} defaultOpacity={0.2} />
      <Bubble size={300} color="#5939dc" left="30vw" top="80vh" defaultOpacity={0.12} />
      <Bubble
        size={300}
        color="#00d6ff"
        left="100vw"
        top="50vh"
        offsetYMultiple={2}
        defaultOpacity={0.2}
      />
    </div>
  );
};

export default LuminousBg;
