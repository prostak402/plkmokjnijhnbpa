'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Clip } from '@/types/clip';

interface BookmarkContextValue {
  bookmarks: Clip[];
  toggleBookmark: (clip: Clip) => void;
}

const BookmarkContext = createContext<BookmarkContextValue | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Clip[]>([]);

  const toggleBookmark = (clip: Clip) => {
    setBookmarks((prev) =>
      prev.find((c) => c.id === clip.id)
        ? prev.filter((c) => c.id !== clip.id)
        : [...prev, clip]
    );
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) {
    throw new Error('useBookmarks must be used within BookmarkProvider');
  }
  return ctx;
}
