import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/src/lib/auth';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ loggedOut: true });
  clearSessionCookie(response);
  return response;
}
