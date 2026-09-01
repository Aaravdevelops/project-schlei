import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { listTeacherUsers } from '@/app/actions/teacher'
import { TeacherAdmin } from '@/components/teacher-admin'

export default async function TeacherPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/teacher-sign-in')
  const [profile] = await db.select({ role: profiles.role }).from(profiles).where(eq(profiles.userId, session.user.id)).limit(1)
  if (profile?.role !== 'teacher') redirect('/dashboard')
  const data = await listTeacherUsers()
  return <main className="teacher-shell"><TeacherAdmin users={data.users} teacherId={data.teacherId} /></main>
}
