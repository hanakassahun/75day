import { NextRequest, NextResponse } from 'next/server';
import { createSession, createUser, findUserByEmail } from '@/src/db';
import { setSessionCookie } from '@/src/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, name } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 });
  }

  const user = await createUser({ email, name, password });
  const session = await createSession(user.id);
  const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  setSessionCookie(response, session.token);
  return response;
}
