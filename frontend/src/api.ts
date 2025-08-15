export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

let token: string | null = null;

export async function authenticate(
  username: string = 'guest',
): Promise<string> {
  const res = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  const data = await res.json();
  token = data.access_token;
  return token;
}

function authHeader() {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getFeed(): Promise<any[]> {
  const res = await fetch(`${API_URL}/feed`, { headers: { ...authHeader() } });
  const data = await res.json();
  return (data.items || []) as any[];
}

export async function likeClip(clipId: string) {
  await fetch(`${API_URL}/like?clip_id=${clipId}`, {
    method: 'POST',
    headers: { ...authHeader() },
  });
}

export async function bookmarkClip(clipId: string) {
  await fetch(`${API_URL}/bookmark?clip_id=${clipId}`, {
    method: 'POST',
    headers: { ...authHeader() },
  });
}

export async function commentClip(clipId: string, text: string) {
  await fetch(
    `${API_URL}/comment?clip_id=${clipId}&text=${encodeURIComponent(text)}`,
    {
      method: 'POST',
      headers: { ...authHeader() },
    },
  );
}
