'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { Clip } from '@/types/clip';
import { useBookmarks } from '@/context/BookmarksContext';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FeedPage() {
  const [genre, setGenre] = useState('all');
  const { data } = useSWR<{ clips: Clip[] }>(`/api/clips?genre=${genre}`, fetcher);
  const clips = useMemo(() => data?.clips ?? [], [data]);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      setIndex(Math.round(el.scrollTop / window.innerHeight));
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const preload = [index - 2, index - 1, index + 1, index + 2];
    preload.forEach((i) => {
      const url = clips[i]?.videoUrl;
      if (url) {
        const v = document.createElement('video');
        v.src = url;
        v.preload = 'auto';
      }
    });
  }, [index, clips]);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory" ref={containerRef}>
      <div className="p-4 flex gap-2">
        {['all', 'action', 'drama'].map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-2 ${genre === g ? 'font-bold underline' : ''}`}
          >
            {g}
          </button>
        ))}
      </div>
      {clips.map((clip) => (
        <div
          key={clip.id}
          className="snap-start h-screen flex items-center justify-center relative"
        >
          <video
            src={clip.videoUrl}
            className="w-full h-full object-cover"
            controls
          />
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button onClick={() => console.log('like', clip.id)}>Like</button>
            <button onClick={() => toggleBookmark(clip)}>
              {bookmarks.find((b) => b.id === clip.id) ? 'Unbookmark' : 'Bookmark'}
            </button>
            <button onClick={() => console.log('comment', clip.id)}>Comment</button>
            <button onClick={() => console.log('share', clip.id)}>Share</button>
            <button onClick={() => console.log('watch', clip.id)}>Watch</button>
          </div>
        </div>
      ))}
    </div>
  );
}
