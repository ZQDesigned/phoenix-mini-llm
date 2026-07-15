import type { PropsWithChildren } from 'react';
import React from 'react';
import { Helmet } from 'dumi';

import Footer from '../../slots/Footer';

interface IndexLayoutProps {
  title?: string;
  desc?: string;
}

const IndexLayout: React.FC<PropsWithChildren<IndexLayoutProps>> = ({ children, title, desc }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        {desc && <meta name="description" content={desc} />}
      </Helmet>
      <div style={{ minHeight: '100vh' }}>{children}</div>
      <Footer />
    </>
  );
};

export default IndexLayout;
