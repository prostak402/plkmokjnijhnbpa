'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Clip } from '@/types/clip';
import {
  authenticate,
  likeClip as apiLikeClip,
  bookmarkClip as apiBookmarkClip,
  commentClip as apiCommentClip,
} from '@/api';

interface Comment {
  text: string;
  time: number;
  ts: number;
  user: string;
}
interface Settings {
  autoplay: boolean;
  muteDefault: boolean;
}

interface AppContextValue {
  likes: Record<string, boolean>;
  bookmarks: Record<string, Clip>;
  comments: Record<string, Comment[]>;
  genres: string[];
  settings: Settings;
  toggleLike: (id: string) => void;
  toggleBookmark: (clip: Clip) => void;
  addComment: (clipId: string, comment: Comment) => void;
  setGenres: (genres: string[]) => void;
  updateSettings: (s: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [likes, setLikes] = useState<Record<string, boolean>>(() =>
    readLS('likes', {}),
  );
  const [bookmarks, setBookmarks] = useState<Record<string, Clip>>(() =>
    readLS('bookmarks', {}),
  );
  const [comments, setComments] = useState<Record<string, Comment[]>>(() =>
    readLS('comments', {}),
  );
  const [genres, setGenres] = useState<string[]>(() => readLS('genres', []));
  const [settings, setSettings] = useState<Settings>(() =>
    readLS('settings', { autoplay: true, muteDefault: true }),
  );

  // obtain JWT token on startup
  useEffect(() => {
    authenticate().catch(() => null);
  }, []);

  useEffect(
    () => localStorage.setItem('likes', JSON.stringify(likes)),
    [likes],
  );
  useEffect(
    () => localStorage.setItem('bookmarks', JSON.stringify(bookmarks)),
    [bookmarks],
  );
  useEffect(
    () => localStorage.setItem('comments', JSON.stringify(comments)),
    [comments],
  );
  useEffect(
    () => localStorage.setItem('genres', JSON.stringify(genres)),
    [genres],
  );
  useEffect(
    () => localStorage.setItem('settings', JSON.stringify(settings)),
    [settings],
  );

  function toggleLike(id: string) {
    setLikes((p) => ({ ...p, [id]: !p[id] }));
    apiLikeClip(id).catch(() => undefined);
  }

  function toggleBookmark(clip: Clip) {
    setBookmarks((p) => {
      const copy = { ...p } as Record<string, Clip>;
      if (copy[clip.id]) delete copy[clip.id];
      else copy[clip.id] = clip;
      return copy;
    });
    if (!bookmarks[clip.id]) {
      apiBookmarkClip(clip.id).catch(() => undefined);
    }
  }

  function addComment(clipId: string, comment: Comment) {
    setComments((p) => ({ ...p, [clipId]: [comment, ...(p[clipId] || [])] }));
    apiCommentClip(clipId, comment.text).catch(() => undefined);
  }

  function updateSettings(s: Partial<Settings>) {
    setSettings((p) => ({ ...p, ...s }));
  }

  const value: AppContextValue = {
    likes,
    bookmarks,
    comments,
    genres,
    settings,
    toggleLike,
    toggleBookmark,
    addComment,
    setGenres,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
