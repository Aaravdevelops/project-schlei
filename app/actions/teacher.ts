'use server'

import { and, asc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { account, media, profiles, session, user, verification } from '@/lib/db/schema'

async function requireTeacher() {
  const current = await auth.api.getSession({ headers: await headers() })
  if (!current?.user) throw new Error('UNAUTHORIZED')
  const [profile] = await db.select({ role: profiles.role }).from(profiles).where(eq(profiles.userId, current.user.id)).limit(1)
  if (profile?.role !== 'teacher') throw new Error('FORBIDDEN')
  return current.user.id
}

export async function listTeacherUsers() {
  const teacherId = await requireTeacher()
  const rows = await db.select({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, role: profiles.role, school: profiles.school }).from(user).leftJoin(profiles, eq(profiles.userId, user.id)).orderBy(asc(user.createdAt))
  return { teacherId, users: rows }
}

export async function deleteTeacherUser(userId: string) {
  const teacherId = await requireTeacher()
  if (!userId || userId === teacherId) throw new Error('INVALID_TARGET')
  await db.transaction(async (tx) => {
    await tx.delete(media).where(eq(media.userId, userId))
    await tx.delete(profiles).where(eq(profiles.userId, userId))
    await tx.delete(session).where(eq(session.userId, userId))
    await tx.delete(account).where(eq(account.userId, userId))
    await tx.delete(verification).where(eq(verification.identifier, userId))
    await tx.delete(user).where(and(eq(user.id, userId)))
  })
  revalidatePath('/teacher')
  return { ok: true }
}
