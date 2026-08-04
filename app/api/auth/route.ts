import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: { id: session.user.id, email: session.user.email, name: session.user.name } });
}
