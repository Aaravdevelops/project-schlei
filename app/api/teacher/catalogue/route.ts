import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { media, profiles, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const profile = await db.select().from(profiles).where(eq(profiles.userId, session.user.id)).limit(1)
  if (profile[0]?.role !== 'teacher') return NextResponse.json({ error: 'Teacher access required' }, { status: 403 })
  const rows = await db.select({ id: media.id, title: media.title, description: media.description, pathname: media.pathname, kind: media.kind, site: media.site, createdAt: media.createdAt, studentId: user.id, studentName: user.name }).from(media).innerJoin(user, eq(media.userId, user.id)).orderBy(media.createdAt)
  return NextResponse.json({ catalogue: rows })
}
