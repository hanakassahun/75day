import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { reflections } from '@/src/db/schema'
import { eq } from 'drizzle-orm'
import { getSessionFromRequest } from '@/src/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  await db.delete(reflections).where(eq(reflections.user_id, session.user.id))
  return NextResponse.json({ success: true })
}
