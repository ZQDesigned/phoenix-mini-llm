import React from 'react';
import { Col, FloatButton } from 'antd';
import { clsx } from 'clsx';
import PrevAndNext from '../../common/PrevAndNext';
import Footer from '../Footer';
import SiteContext from '../SiteContext';
import DocAnchor, { useStyle as useDocAnchorStyle } from './DocAnchor';

export interface ContentProps {
  children?: React.ReactNode;
  className?: string;
}

const Content: React.FC<ContentProps> = ({ children, className }) => {
  const { styles: anchorStyles } = useDocAnchorStyle();
  const { direction } = React.useContext(SiteContext);
  const isRTL = direction === 'rtl';

  return (
    <Col xxl={20} xl={19} lg={18} md={18} sm={24} xs={24} className={className}>
      <DocAnchor />
      <article className={clsx(anchorStyles.articleWrapper, 'main-wrapper', { rtl: isRTL })}>
        <div style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
          <FloatButton.BackTop />
        </div>
      </article>
      <PrevAndNext rtl={isRTL} />
      <Footer />
    </Col>
  );
};

export default Content;
