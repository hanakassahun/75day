import { pgTable, uuid, text, integer, date, smallint, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const reflections = pgTable('reflections', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id'),
  challenge_id: uuid('challenge_id'),
  day: integer('day'),
  entry_date: date('entry_date'),
  content: text('content').notNull(),
  mood: smallint('mood'),
  rating: smallint('rating'),
  meta: jsonb('meta').$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
