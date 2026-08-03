import { NextRequest, NextResponse } from 'next/server';
import { createSession, createUser, findUserByEmail, getUserById, verifyUserCredentials } from '@/src/db';
import { clearSessionCookie, getSessionFromRequest, setSessionCookie } from '@/src/lib/auth';

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  const body = await request.json();

  if (action === 'signup') {
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

  if (action === 'login') {
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

  if (action === 'logout') {
    const response = NextResponse.json({ loggedOut: true });
    await clearSessionCookie(response);
    return response;
  }

  return NextResponse.json({ error: 'Invalid auth action' }, { status: 400 });
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: { id: session.user.id, email: session.user.email, name: session.user.name } });
}
