import React from 'react';
import { Helmet, useRouteMeta, useSiteData } from 'dumi';

const CommonHelmet: React.FC = () => {
  const meta = useRouteMeta();
  const { themeConfig } = useSiteData();
  const siteName = themeConfig.name || 'Phoenix Mini LLM';

  const [title, description] = React.useMemo<[string, string]>(() => {
    let helmetTitle: string;

    if (!meta.frontmatter.subtitle && !meta.frontmatter.title) {
      helmetTitle = `404 Not Found - ${siteName}`;
    } else if (meta.frontmatter.subtitle) {
      helmetTitle = `${meta.frontmatter.subtitle} ${meta.frontmatter.title || ''} - ${siteName}`;
    } else {
      helmetTitle = `${meta.frontmatter.title || ''} - ${siteName}`;
    }

    return [helmetTitle, meta.frontmatter.description || ''];
  }, [meta.frontmatter.description, meta.frontmatter.subtitle, meta.frontmatter.title, siteName]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default CommonHelmet;
