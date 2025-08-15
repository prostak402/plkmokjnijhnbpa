'use client';

import { useEffect, useRef, useState } from 'react';
import { CLIPS, GENRES } from '@/data/mock';
import { useApp } from '@/context/BookmarksContext';

export default function FeedPage() {
  const {
    likes,
    bookmarks,
    comments,
    genres,
    settings,
    toggleLike,
    toggleBookmark,
    addComment,
  } = useApp();
  const list = CLIPS.filter((c) =>
    genres.length ? c.genres.some((g) => genres.includes(g)) : true,
  );
  const [currentId, setCurrentId] = useState(list[0]?.id);
  const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && en.intersectionRatio > 0.6) {
            const id = (en.target as HTMLElement).dataset.id;
            if (id) setCurrentId(id);
          }
        });
      },
      { threshold: [0.6] },
    );
    el.querySelectorAll('section.clip').forEach((sec) => io.observe(sec));
    return () => io.disconnect();
  }, [list]);

  const currentClip = list.find((c) => c.id === currentId) || list[0];

  function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!showCommentsFor || !commentText.trim()) return;
    const item = {
      text: commentText.trim(),
      time: 0,
      ts: Date.now(),
      user: 'Гость',
    };
    addComment(showCommentsFor, item);
    setCommentText('');
  }

  return (
    <section className="stage" ref={containerRef}>
      <div className="video-col">
        {list.map((clip) => (
          <section className="clip" data-id={clip.id} key={clip.id}>
            <video
              src={clip.src}
              poster={clip.poster}
              preload="metadata"
              playsInline
              muted={settings.muteDefault}
              autoPlay={settings.autoplay}
            />
            <div className="info">
              <div className="title">{clip.filmTitle}</div>
              <div className="meta">
                {clip.year} •{' '}
                {clip.genres
                  .map((g) => GENRES.find((x) => x.id === g)?.name || g)
                  .join(' • ')}
              </div>
              <div className="logline">{clip.logline}</div>
              <div className="tags">
                {clip.tags?.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="actions-rail">
              <div
                className="action"
                onClick={() => toggleLike(clip.id)}
                title="Нравится"
              >
                <svg className="ic">
                  <use href="#i-heart" />
                </svg>
                <div className="count">{likes[clip.id] ? 1 : 0}</div>
              </div>
              <div
                className="action"
                onClick={() => toggleBookmark(clip)}
                title="В закладки"
              >
                <svg className="ic">
                  <use href="#i-bookmark" />
                </svg>
                <div className="count">{bookmarks[clip.id] ? 1 : 0}</div>
              </div>
              <div
                className="action"
                onClick={() => setShowCommentsFor(clip.id)}
                title="Комментарии"
              >
                <svg className="ic">
                  <use href="#i-chat" />
                </svg>
                <div className="count">{(comments[clip.id] || []).length}</div>
              </div>
              <div
                className="action"
                onClick={() => navigator.share?.({ url: clip.watchUrl })}
                title="Поделиться"
              >
                <svg className="ic">
                  <use href="#i-share" />
                </svg>
              </div>
            </div>
          </section>
        ))}
        {currentClip && (
          <div className="cta">
            <a
              className="cta-watch"
              href={currentClip.watchUrl}
              target="_blank"
              rel="noopener"
            >
              <svg className="ic">
                <use href="#i-play" />
              </svg>
              <div className="cta-label">
                <div className="cta-title">
                  Смотреть: {currentClip.filmTitle}
                </div>
                <div className="cta-sub">Откроется на вашем киносайте</div>
              </div>
            </a>
          </div>
        )}
      </div>

      {showCommentsFor && (
        <div className="sheet active" aria-modal="true" role="dialog">
          <div className="grab"></div>
          <div className="sheet-header">
            <div className="sheet-title">Комментарии</div>
            <button
              className="btn-ghost"
              onClick={() => setShowCommentsFor(null)}
              aria-label="Закрыть"
            >
              <svg className="ic">
                <use href="#i-x" />
              </svg>
            </button>
          </div>
          <div className="sheet-list">
            {(comments[showCommentsFor] || []).map((it, idx) => (
              <div className="cmt" key={idx}>
                <div className="ava">{(it.user || 'Г').slice(0, 1)}</div>
                <div className="cbody">
                  <div>
                    <strong>{it.user || 'Гость'}</strong>{' '}
                    <span className="ctime">
                      • {new Date(it.ts).toLocaleString()}
                    </span>
                  </div>
                  <div>{it.text}</div>
                </div>
              </div>
            ))}
          </div>
          <form className="cform" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={300}
              placeholder="Оставьте комментарий"
            />
            <button className="btn primary" type="submit">
              Отправить
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
