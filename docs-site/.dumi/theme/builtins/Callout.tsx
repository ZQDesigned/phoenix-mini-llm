import * as React from 'react';

type CalloutTone = 'note' | 'warning' | 'success';

export default function Callout({
  title,
  tone = 'note',
  children,
}: {
  title: string;
  tone?: CalloutTone;
  children?: React.ReactNode;
}) {
  return React.createElement(
    'div',
    { className: `phoenix-callout phoenix-callout--${tone}` },
    React.createElement('strong', { className: 'phoenix-callout__title' }, title),
    React.createElement('div', null, children),
  );
}
