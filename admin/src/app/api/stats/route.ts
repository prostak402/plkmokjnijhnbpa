export async function GET() {
  try {
    const res = await fetch('http://localhost:8000/admin/stats');
    if (res.ok) {
      return Response.json(await res.json());
    }
  } catch (e) {}
  return Response.json({ clips: 0, users: 0 });
}
