import React from 'react';
import InlineCard from './styles/InlineCard';

import {
  Common,
  Demo,
  HeadingAnchor,
  Highlight,
  Markdown,
  NProgress,
  PreviewImage,
  Reset,
  Responsive,
  SearchBar,
} from './styles';

const GlobalStyles: React.FC = () => (
  <>
    <Reset />
    <Common />
    <Markdown />
    <Highlight />
    <Demo />
    <Responsive />
    <NProgress />
    <PreviewImage />
    <InlineCard />
    <HeadingAnchor />
    <SearchBar />
  </>
);

export default GlobalStyles;
