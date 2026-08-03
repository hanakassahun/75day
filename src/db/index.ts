import { db } from '../../lib/db';
import { reflections, taskStatuses } from './schema';
import { eq } from 'drizzle-orm';
import { createSession, createUser, deleteSession, findUserByEmail, getSessionByToken, verifyUserCredentials } from './users';

export const reflectionsTable = reflections;

export const getAllReflections = async (userId: string) => {
  return db.select().from(reflections).where(eq(reflections.user_id, userId));
};

export const getReflectionById = async (userId: string, id: string) => {
  return db.select().from(reflections).where(eq(reflections.user_id, userId), eq(reflections.id, id));
};

export const createReflection = async (data: {
  user_id: string;
  challenge_id?: string;
  day?: number;
  entry_date?: Date;
  content: string;
  mood?: number;
  rating?: number;
  photo_url?: string;
  meta?: Record<string, unknown>;
  tasks?: Array<{ task_id: string; completed: boolean; notes?: string; meta?: Record<string, unknown> }>;
}) => {
  const [reflection] = await db.insert(reflections).values({
    user_id: data.user_id,
    challenge_id: data.challenge_id,
    day: data.day,
    entry_date: data.entry_date,
    content: data.content,
    mood: data.mood,
    rating: data.rating,
    photo_url: data.photo_url,
    meta: data.meta,
  }).returning();

  if (data.tasks && data.tasks.length > 0 && reflection?.id) {
    await db.insert(taskStatuses).values(data.tasks.map((task) => ({
      reflection_id: reflection.id,
      task_id: task.task_id,
      completed: task.completed,
      notes: task.notes,
      meta: task.meta,
    })));
  }

  return reflection;
};

export { createSession, createUser, deleteSession, findUserByEmail, getSessionByToken, verifyUserCredentials };
