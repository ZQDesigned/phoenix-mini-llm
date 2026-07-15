import type { ReactNode } from 'react';

export function StageChecklist({ items }: { items: ReactNode[] }) {
  return (
    <ol className="phoenix-stage-checklist">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
}
