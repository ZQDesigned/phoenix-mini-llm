import { createElement, type ReactNode } from 'react';

type CalloutTone = 'note' | 'warning' | 'success';

export default function Callout({
  title,
  tone = 'note',
  children,
}: {
  title: string;
  tone?: CalloutTone;
  children?: ReactNode;
}) {
  return createElement(
    'div',
    { className: `phoenix-callout phoenix-callout--${tone}` },
    createElement('strong', { className: 'phoenix-callout__title' }, title),
    createElement('div', null, children),
  );
}
