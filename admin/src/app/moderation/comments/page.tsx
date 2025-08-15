'use client';

import useSWR from 'swr';
import { useState } from 'react';

interface Comment {
  id: number;
  user: string;
  text: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CommentModeration() {
  const { data, mutate } = useSWR('/api/comments', fetcher);
  const [loading, setLoading] = useState(false);

  const deleteComment = async (id: number) => {
    setLoading(true);
    await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
    mutate();
    setLoading(false);
  };

  return (
    <div>
      <h1>Comment Moderation</h1>
      {data?.items?.map((c: Comment) => (
        <div key={c.id} style={{ marginBottom: '0.5rem' }}>
          <strong>{c.user}:</strong> {c.text}{' '}
          <button disabled={loading} onClick={() => deleteComment(c.id)}>
            delete
          </button>
        </div>
      ))}
    </div>
  );
}
