import { createElement } from 'react';

type TrackCard = {
  title: string;
  description: string;
  href: string;
  action: string;
};

export default function TrackCardGrid({ cards }: { cards: TrackCard[] }) {
  return createElement(
    'div',
    { className: 'phoenix-track-grid' },
    cards.map((card) =>
      createElement(
        'section',
        { className: 'phoenix-track-card', key: card.href },
        createElement('h3', null, card.title),
        createElement('p', null, card.description),
        createElement('a', { href: card.href }, card.action),
      ),
    ),
  );
}
