import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrUpdateReflection, getAllReflections } from '@/src/db';
import { getSessionFromRequest } from '@/src/lib/auth';
import { TOTAL_DAYS } from '@/lib/challenge-data';

const taskSchema = z.object({
  task_id: z.string().min(1),
  completed: z.boolean(),
  notes: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

const reflectionBodySchema = z.object({
  challenge_id: z.string().uuid().optional(),
  day: z.number().int().min(1).max(TOTAL_DAYS),
  entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'entry_date must be YYYY-MM-DD'),
  content: z.string().min(1),
  win: z.string().optional(),
  mood: z.number().int().min(1).max(5).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  photo_url: z.string().url().optional(),
  meta: z.record(z.unknown()).optional(),
  tasks: z.array(taskSchema).optional(),
});

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
  const parsed = reflectionBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().formErrors.join(', ') }, { status: 400 });
  }

  try {
    const year = Number(parsed.data.entry_date.slice(0, 4))
    const month = Number(parsed.data.entry_date.slice(5, 7)) - 1
    const day = Number(parsed.data.entry_date.slice(8, 10))
    const entryDate = new Date(Date.UTC(year, month, day))
    const now = new Date()
    const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    const entryUtc = Date.UTC(entryDate.getUTCFullYear(), entryDate.getUTCMonth(), entryDate.getUTCDate())

    if (entryUtc < todayUtc || parsed.data.day < 1 || parsed.data.day > TOTAL_DAYS) {
      return NextResponse.json(
        { error: 'Past logs are locked for accountability. No changes allowed!' },
        { status: 403 },
      )
    }

    const newReflection = await createOrUpdateReflection({
      user_id: session.user.id,
      challenge_id: parsed.data.challenge_id,
      day: parsed.data.day,
      entry_date: entryDate,
      content: parsed.data.content,
      win: parsed.data.win,
      mood: parsed.data.mood,
      rating: parsed.data.rating,
      photo_url: parsed.data.photo_url,
      meta: parsed.data.meta,
      tasks: parsed.data.tasks,
    });

    return NextResponse.json(newReflection);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (/duplicate|unique/i.test(message)) {
      return NextResponse.json({ error: 'Day already logged.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Unable to save reflection' }, { status: 500 });
  }
}
