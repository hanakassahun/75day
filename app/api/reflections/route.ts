import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateReflection, getAllReflections } from '@/src/db';
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
  if (body.day === undefined || body.day === null) {
    return NextResponse.json({ error: 'Missing required field: day' }, { status: 400 });
  }
  if (body.content === undefined || body.content === null) {
    return NextResponse.json({ error: 'Missing required field: content' }, { status: 400 });
  }

  const newReflection = await createOrUpdateReflection({
    user_id: session.user.id,
    challenge_id: body.challenge_id,
    day: body.day,
    entry_date: body.entry_date ? new Date(body.entry_date) : undefined,
    content: body.content,
    win: body.win,
    mood: body.mood,
    rating: body.rating,
    photo_url: body.photo_url,
    meta: body.meta,
    tasks: body.tasks,
  });

  return NextResponse.json(newReflection);
}
