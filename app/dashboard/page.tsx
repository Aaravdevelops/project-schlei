import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Dashboard } from '@/components/dashboard'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
export default async function DashboardPage() { const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) redirect('/sign-in'); const profile = await db.select({ role: profiles.role }).from(profiles).where(eq(profiles.userId, session.user.id)).limit(1); return <Dashboard user={session.user} isTeacher={profile[0]?.role === 'teacher'} /> }
