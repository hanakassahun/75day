import { db } from '../../lib/db';
import { reflections } from './schema';
import { eq } from 'drizzle-orm';

export const reflectionsTable = reflections;

export const getAllReflections = async () => {
  return db.select().from(reflections);
};

export const getReflectionById = async (id: string) => {
  return db.select().from(reflections).where(eq(reflections.id, id));
};

export const createReflection = async (data: {
  user_id?: string;
  challenge_id?: string;
  day?: number;
  entry_date?: Date;
  content: string;
  mood?: number;
  rating?: number;
  meta?: Record<string, unknown>;
}) => {
  return db.insert(reflections).values(data).returning();
};
