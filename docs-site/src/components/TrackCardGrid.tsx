type TrackCard = {
  title: string;
  description: string;
  href: string;
  action: string;
};

export function TrackCardGrid({ cards }: { cards: TrackCard[] }) {
  return (
    <div className="phoenix-track-grid">
      {cards.map((card) => (
        <section className="phoenix-track-card" key={card.href}>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
          <a href={card.href}>{card.action}</a>
        </section>
      ))}
    </div>
  );
}
