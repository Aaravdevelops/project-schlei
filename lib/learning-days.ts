import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { learningDays, profiles } from '@/lib/db/schema'

import { DAY_COUNT } from '@/lib/learning-day-constants'

export { DAY_COUNT }

export async function getLearningDay(day: number) {
  if (!Number.isInteger(day) || day < 1 || day > DAY_COUNT) return null
  const [entry] = await db.select().from(learningDays).where(eq(learningDays.day, day)).limit(1)
  return entry ?? { day, title: `Day ${day}`, body: '', imageUrl: null, imageAlt: null }
}

export async function requireTeacher() {
  const current = await auth.api.getSession({ headers: await headers() })
  if (!current?.user) throw new Error('UNAUTHORIZED')
  const [profile] = await db.select({ role: profiles.role }).from(profiles).where(eq(profiles.userId, current.user.id)).limit(1)
  if (profile?.role !== 'teacher') throw new Error('FORBIDDEN')
  return current.user.id
}

export async function getLearningDayEditor(day: number) {
  const userId = await requireTeacher()
  return { userId, entry: await getLearningDay(day) }
}

export async function saveLearningDay(day: number, title: string, body: string, imageUrl: string | null, imageAlt: string | null) {
  const userId = await requireTeacher()
  if (!Number.isInteger(day) || day < 1 || day > DAY_COUNT) throw new Error('INVALID_DAY')
  const cleanTitle = title.trim().slice(0, 120)
  const cleanBody = body.trim().slice(0, 20000)
  if (!cleanTitle) throw new Error('TITLE_REQUIRED')
  await db.insert(learningDays).values({ day, title: cleanTitle, body: cleanBody, imageUrl: imageUrl?.trim().slice(0, 2000) || null, imageAlt: imageAlt?.trim().slice(0, 200) || null, updatedBy: userId }).onConflictDoUpdate({ target: learningDays.day, set: { title: cleanTitle, body: cleanBody, imageUrl: imageUrl?.trim().slice(0, 2000) || null, imageAlt: imageAlt?.trim().slice(0, 200) || null, updatedBy: userId, updatedAt: new Date() } })
}

export async function getLearningDays() {
  return db.select({ day: learningDays.day, title: learningDays.title, imageUrl: learningDays.imageUrl }).from(learningDays).orderBy(learningDays.day)
}

export function isSafeImageUrl(value: string) {
  try { const url = new URL(value); return url.protocol === 'https:' }
  catch { return false }
}
