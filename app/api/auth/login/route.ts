import { NextRequest, NextResponse } from 'next/server';
import { createSession, verifyUserCredentials } from '@/src/db';
import { setSessionCookie } from '@/src/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await verifyUserCredentials(email, password);
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const session = await createSession(user.id);
  const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  setSessionCookie(response, session.token);
  return response;
}
