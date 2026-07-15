import React from 'react';
import { Helmet, useRouteMeta, useSiteData } from 'dumi';

const CommonHelmet: React.FC = () => {
  const meta = useRouteMeta();
  const { themeConfig } = useSiteData();
  const siteName = themeConfig.name || 'Phoenix Mini LLM';

  const [title, description] = React.useMemo<[string, string]>(() => {
    if (!meta.frontmatter.title) {
      return [`${siteName}`, meta.frontmatter.description || ''];
    }

    return [
      `${meta.frontmatter.title} - ${siteName}`,
      meta.frontmatter.description || '',
    ];
  }, [meta.frontmatter.description, meta.frontmatter.title, siteName]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default CommonHelmet;
