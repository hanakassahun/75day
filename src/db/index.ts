import { db } from '../../lib/db';
import { reflections, taskStatuses } from './schema';
import { and, eq, inArray } from 'drizzle-orm';
import { createSession, createUser, deleteSession, findUserByEmail, getSessionByToken, verifyUserCredentials } from './users';

export const reflectionsTable = reflections;

export const getAllReflections = async (userId: string) => {
  const allReflections = await db
    .select()
    .from(reflections)
    .where(eq(reflections.user_id, userId))
    .orderBy(reflections.day);

  if (allReflections.length === 0) {
    return [];
  }

  const reflectionIds = allReflections.map((reflection) => reflection.id);
  const allTasks = await db.select().from(taskStatuses).where(inArray(taskStatuses.reflection_id, reflectionIds));

  return allReflections.map((reflection) => ({
    ...reflection,
    tasks: allTasks.filter((task) => task.reflection_id === reflection.id),
  }));
};

export const getReflectionById = async (userId: string, id: string) => {
  const [reflection] = await db
    .select()
    .from(reflections)
    .where(and(eq(reflections.user_id, userId), eq(reflections.id, id)));

  if (!reflection) return null;

  const tasks = await db.select().from(taskStatuses).where(eq(taskStatuses.reflection_id, reflection.id));

  return {
    ...reflection,
    tasks,
  };
};

export const createOrUpdateReflection = async (data: {
  user_id: string;
  challenge_id?: string;
  day: number;
  entry_date?: Date;
  content: string;
  win?: string;
  mood?: number;
  rating?: number;
  photo_url?: string;
  meta?: Record<string, unknown>;
  tasks?: Array<{ task_id: string; completed: boolean; notes?: string; meta?: Record<string, unknown> }>;
}) => {
  const [existing] = await db
    .select()
    .from(reflections)
    .where(and(eq(reflections.user_id, data.user_id), eq(reflections.day, data.day)));

  const values = {
    user_id: data.user_id,
    challenge_id: data.challenge_id,
    day: data.day,
    entry_date: data.entry_date ? data.entry_date.toISOString().slice(0, 10) : undefined,
    content: data.content,
    win: data.win,
    mood: data.mood,
    rating: data.rating,
    photo_url: data.photo_url,
    meta: data.meta,
  };

  const [reflection] = existing
    ? await db.update(reflections).set(values).where(eq(reflections.id, existing.id)).returning()
    : await db.insert(reflections).values(values).returning();

  if (!reflection?.id) {
    return reflection;
  }

  await db.delete(taskStatuses).where(eq(taskStatuses.reflection_id, reflection.id));

  if (data.tasks && data.tasks.length > 0) {
    await db.insert(taskStatuses).values(
      data.tasks.map((task) => ({
        reflection_id: reflection.id,
        task_id: task.task_id,
        completed: task.completed,
        notes: task.notes,
        meta: task.meta,
      })),
    );
  }

  return reflection;
};

export { createSession, createUser, deleteSession, findUserByEmail, getSessionByToken, verifyUserCredentials };
