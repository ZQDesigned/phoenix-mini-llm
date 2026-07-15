import React from 'react';

import { Common, HeadingAnchor, Markdown, Reset, Responsive, SearchBar } from './styles';

const GlobalStyles: React.FC = () => (
  <>
    <Reset />
    <Common />
    <Markdown />
    <Responsive />
    <HeadingAnchor />
    <SearchBar />
  </>
);

export default GlobalStyles;
