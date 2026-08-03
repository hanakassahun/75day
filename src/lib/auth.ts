import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { deleteSession, getSessionByToken } from '@/src/db';

const SESSION_COOKIE_NAME = 'session_token';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, stored: string) => {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(key, 'hex'), Buffer.from(derived, 'hex'));
};

export const getSessionToken = (request: NextRequest) => {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value;
};

export const setSessionCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
};

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  });
};

export const getSessionFromRequest = async (request: NextRequest) => {
  const token = getSessionToken(request);
  if (!token) return null;
  return getSessionByToken(token);
};

export const invalidateSession = async (request: NextRequest, response: NextResponse) => {
  const token = getSessionToken(request);
  if (token) {
    await deleteSession(token);
  }
  clearSessionCookie(response);
};
