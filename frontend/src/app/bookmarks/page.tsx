'use client';

import { useBookmarks } from '@/context/BookmarksContext';

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  if (bookmarks.length === 0) {
    return <p className="p-4">No bookmarks yet.</p>;
  }
  return (
    <div className="p-4 space-y-4">
      {bookmarks.map((clip) => (
        <div key={clip.id} className="space-y-2">
          <video src={clip.videoUrl} controls className="w-full" />
          <p>{clip.title}</p>
        </div>
      ))}
    </div>
  );
}
