import { db } from '../../lib/db';
import { users, sessions } from './schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/src/lib/auth';
import { randomUUID } from 'crypto';

export const findUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
};

export const createUser = async (data: { email: string; password: string; name?: string }) => {
  const password_hash = hashPassword(data.password);
  const [user] = await db.insert(users).values({
    email: data.email,
    name: data.name,
    password_hash,
  }).returning();
  return user;
};

export const verifyUserCredentials = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user || !user.password_hash) {
    return null;
  }
  const valid = verifyPassword(password, user.password_hash);
  if (!valid) {
    return null;
  }
  return user;
};

export const createSession = async (userId: string) => {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const [session] = await db.insert(sessions).values({
    user_id: userId,
    token,
    expires_at: expiresAt,
  }).returning();
  return session;
};

export const getSessionByToken = async (token: string) => {
  const [record] = await db.select({
    session: sessions,
    user: users,
  }).from(sessions)
    .innerJoin(users, eq(users.id, sessions.user_id))
    .where(eq(sessions.token, token));

  if (!record || record.session.expires_at <= new Date()) {
    return null;
  }

  return {
    session: record.session,
    user: record.user,
  };
};

export const deleteSession = async (token: string) => {
  await db.delete(sessions).where(eq(sessions.token, token));
};
