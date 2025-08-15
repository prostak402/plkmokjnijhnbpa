import { NextResponse } from 'next/server';
import { Clip } from '@/types/clip';

const clips: Clip[] = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    genre: 'action',
  },
  {
    id: '2',
    title: 'Sintel',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/sintel.mp4',
    genre: 'drama',
  },
  {
    id: '3',
    title: 'Tears of Steel',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    genre: 'action',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') ?? 'all';
  const filtered = genre === 'all' ? clips : clips.filter((c) => c.genre === genre);
  return NextResponse.json({ clips: filtered });
}
