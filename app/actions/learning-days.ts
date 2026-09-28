'use server'

import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { learningDays, profiles } from '@/lib/db/schema'

async function requireTeacher() { const current = await auth.api.getSession({ headers: await headers() }); if (!current?.user) throw new Error('UNAUTHORIZED'); const [profile] = await db.select({ role: profiles.role }).from(profiles).where(eq(profiles.userId, current.user.id)).limit(1); if (profile?.role !== 'teacher') throw new Error('FORBIDDEN'); return current.user.id }

export async function saveLearningDay(day: number, title: string, body: string, imageUrl: string | null, imageAlt: string | null) { const userId = await requireTeacher(); if (!Number.isInteger(day) || day < 1 || day > 14) throw new Error('INVALID_DAY'); const cleanTitle = title.trim().slice(0, 120); const cleanBody = body.trim().slice(0, 20000); if (!cleanTitle) throw new Error('TITLE_REQUIRED'); await db.insert(learningDays).values({ day, title: cleanTitle, body: cleanBody, imageUrl: imageUrl?.trim().slice(0, 2000) || null, imageAlt: imageAlt?.trim().slice(0, 200) || null, updatedBy: userId }).onConflictDoUpdate({ target: learningDays.day, set: { title: cleanTitle, body: cleanBody, imageUrl: imageUrl?.trim().slice(0, 2000) || null, imageAlt: imageAlt?.trim().slice(0, 200) || null, updatedBy: userId, updatedAt: new Date() } }); revalidatePath(`/learning/day/${day}`); revalidatePath('/') }
