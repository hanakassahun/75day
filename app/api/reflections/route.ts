import { NextRequest, NextResponse } from 'next/server';
import { createReflection, getAllReflections } from '@/src/db';

export async function GET() {
  const reflections = await getAllReflections();
  return NextResponse.json(reflections);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body?.content) {
    return NextResponse.json({ error: 'Missing content' }, { status: 400 });
  }

  const newReflection = await createReflection({
    content: body.content,
    user_id: body.user_id,
    challenge_id: body.challenge_id,
    day: body.day,
    entry_date: body.entry_date ? new Date(body.entry_date) : undefined,
    mood: body.mood,
    rating: body.rating,
    meta: body.meta,
  });

  return NextResponse.json(newReflection);
}
