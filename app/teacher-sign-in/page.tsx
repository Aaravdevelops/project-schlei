import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { auth } from '@/lib/auth'

export default async function TeacherSignIn() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/teacher')
  return <main className="auth-shell"><div className="auth-card"><p className="kicker clay-text">Teacher access</p><h1>Open the<br /><em>field desk.</em></h1><p>Sign in with an account marked as teacher to manage the exchange.</p><AuthForm mode="sign-in" redirectTo="/teacher" /><p className="auth-switch">Not a teacher? <Link href="/sign-in">Student sign in</Link></p></div></main>
}
