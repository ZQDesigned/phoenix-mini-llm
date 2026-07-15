import type { ReactNode } from 'react';

export type CalloutTone = 'note' | 'warning' | 'success';

export function Callout({
  title,
  tone = 'note',
  children,
}: {
  title: string;
  tone?: CalloutTone;
  children: ReactNode;
}) {
  return (
    <div className={`phoenix-callout phoenix-callout--${tone}`}>
      <strong className="phoenix-callout__title">{title}</strong>
      <div>{children}</div>
    </div>
  );
}
