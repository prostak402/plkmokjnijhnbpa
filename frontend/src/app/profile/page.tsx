'use client';

import { useState } from 'react';
import { useApp } from '@/context/BookmarksContext';
import { GENRES } from '@/data/mock';

export default function ProfilePage() {
  const { genres, settings, setGenres, updateSettings } = useApp();
  const [open, setOpen] = useState(false);

  const currentGenres = genres.length
    ? GENRES.filter((g) => genres.includes(g.id))
        .map((g) => g.name)
        .join(', ')
    : 'Не выбрано';

  function toggleGenre(id: string) {
    const list = genres.includes(id)
      ? genres.filter((g) => g !== id)
      : [...genres, id];
    setGenres(list);
  }

  return (
    <section className="panel" aria-label="Профиль">
      <h2 style={{ margin: '8px 0 6px' }}>Профиль</h2>
      <p className="muted">
        Гость. Включите вход, чтобы синхронизировать закладки между
        устройствами.
      </p>
      <div style={{ height: '12px' }}></div>
      <h3 style={{ margin: '16px 0 6px' }}>Настройки воспроизведения</h3>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '8px 0',
        }}
      >
        <input
          id="autoplayToggle"
          type="checkbox"
          checked={settings.autoplay}
          onChange={(e) => updateSettings({ autoplay: e.target.checked })}
        />{' '}
        Автовоспроизведение
      </label>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '8px 0',
        }}
      >
        <input
          id="muteDefaultToggle"
          type="checkbox"
          checked={settings.muteDefault}
          onChange={(e) => updateSettings({ muteDefault: e.target.checked })}
        />{' '}
        Начинать без звука
      </label>
      <div style={{ height: '16px' }}></div>
      <h3 style={{ margin: '16px 0 6px' }}>Жанры</h3>
      <div className="muted" id="currentGenres">
        {currentGenres}
      </div>
      <div style={{ height: '8px' }}></div>
      <button className="btn" onClick={() => setOpen(true)}>
        Изменить жанры
      </button>

      {open && (
        <div className="onb active" id="onb">
          <div className="onb-card">
            <h2>Выберите жанры</h2>
            <div className="muted">
              Выберите 3+ жанра — рекомендации станут точнее
            </div>
            <div className="chips" id="genreChips">
              {GENRES.map((g) => (
                <div
                  key={g.id}
                  className={`chip ${genres.includes(g.id) ? 'active' : ''}`}
                  data-id={g.id}
                  onClick={() => toggleGenre(g.id)}
                >
                  {g.name}
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginTop: '10px',
              }}
            >
              <button className="btn" onClick={() => setOpen(false)}>
                Пропустить
              </button>
              <button className="btn primary" onClick={() => setOpen(false)}>
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
