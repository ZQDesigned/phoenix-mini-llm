import { createElement, type ReactNode } from 'react';

export default function StageChecklist({ items }: { items: ReactNode[] }) {
  return createElement(
    'ol',
    { className: 'phoenix-stage-checklist' },
    items.map((item, index) => createElement('li', { key: index }, item)),
  );
}
