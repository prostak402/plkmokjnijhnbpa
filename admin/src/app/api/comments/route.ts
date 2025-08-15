let comments = [
  { id: 1, user: 'alice', text: 'Nice clip!' },
  { id: 2, user: 'bob', text: 'Needs review' },
];

export async function GET() {
  return Response.json({ items: comments });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  comments = comments.filter((c) => c.id !== id);
  return Response.json({ status: 'deleted' });
}
