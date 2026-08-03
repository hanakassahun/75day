import { NextRequest, NextResponse } from 'next/server';
import { createReflection, getAllReflections } from '@/src/db';
import { getSessionFromRequest } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const reflections = await getAllReflections(session.user.id);
  return NextResponse.json(reflections);
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const body = await request.json();

  if (!body?.content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }

  const newReflection = await createReflection({
    user_id: session.user.id,
    content: body.content,
    challenge_id: body.challenge_id,
    day: body.day,
    entry_date: body.entry_date ? new Date(body.entry_date) : undefined,
    mood: body.mood,
    rating: body.rating,
    photo_url: body.photo_url,
    meta: body.meta,
    tasks: body.tasks,
  });

  return NextResponse.json(newReflection);
}
