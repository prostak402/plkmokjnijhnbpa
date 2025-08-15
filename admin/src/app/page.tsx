'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const { data } = useSWR('/api/stats', fetcher);
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Clip count: {data?.clips ?? 0}</p>
      <p>User activity: {data?.users ?? 0}</p>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => (window.location.href = '/upload')}>Upload Clip</button>
        <button onClick={() => (window.location.href = '/settings')} style={{ marginLeft: '0.5rem' }}>
          Settings
        </button>
      </div>
    </div>
  );
}
