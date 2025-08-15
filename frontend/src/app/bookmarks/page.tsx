'use client';

import { useApp } from '@/context/BookmarksContext';

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useApp();
  const entries = Object.values(bookmarks);
  return (
    <section className="panel" aria-label="Закладки">
      <h2 style={{ margin: '8px 0 12px' }}>Закладки</h2>
      <div
        className="grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3,1fr)',
          gap: '14px',
        }}
      >
        {entries.length === 0 && (
          <div className="muted" style={{ padding: '16px' }}>
            В закладках пусто. Добавляйте клипы — вернётесь к ним позже.
          </div>
        )}
        {entries.map((b) => (
          <div
            key={b.id}
            style={{
              background: 'rgba(255,255,255,.04)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <img
              alt={b.filmTitle}
              src={`https://picsum.photos/seed/${b.id}/400/600`}
              style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }}
            />
            <div style={{ padding: '10px' }}>
              <div style={{ fontWeight: 700 }}>{b.filmTitle}</div>
              <div
                className="muted"
                style={{ fontSize: '13px', marginTop: '4px' }}
              >
                Сохранено
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <a
                  className="btn primary"
                  href={b.watchUrl}
                  target="_blank"
                  rel="noopener"
                >
                  Смотреть
                </a>
                <button className="btn" onClick={() => toggleBookmark(b)}>
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
