export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({});
  try {
    const res = await fetch(`http://localhost:8000/kinopoisk?id=${id}`);
    if (res.ok) {
      return Response.json(await res.json());
    }
  } catch (e) {}
  // Fallback mock data
  return Response.json({
    title: 'Sample title',
    description: 'Sample description',
    poster: '',
  });
}
