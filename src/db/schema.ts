import { pgTable, uuid, text, integer, date, smallint, timestamp, jsonb, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const reflections = pgTable('reflections', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  challenge_id: uuid('challenge_id'),
  day: integer('day'),
  entry_date: date('entry_date'),
  content: text('content').notNull(),
  win: text('win'),
  mood: smallint('mood'),
  rating: smallint('rating'),
  photo_url: text('photo_url'),
  meta: jsonb('meta').$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const taskStatuses = pgTable('task_statuses', {
  id: uuid('id').defaultRandom().primaryKey(),
  reflection_id: uuid('reflection_id').notNull().references(() => reflections.id, { onDelete: 'cascade' }),
  task_id: text('task_id').notNull(),
  completed: boolean('completed').notNull().default(false),
  notes: text('notes'),
  meta: jsonb('meta').$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
