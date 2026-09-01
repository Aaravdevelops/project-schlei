import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { auth } from '@/lib/auth'
export default async function SignIn() { const session = await auth.api.getSession({ headers: await headers() }); if (session?.user) redirect('/dashboard'); return <main className="auth-shell"><div className="auth-card"><p className="kicker blue-text">Nature Beyond Borders</p><h1>Welcome<br /><em>back.</em></h1><p>Sign in to open your student or teacher workspace.</p><AuthForm mode="sign-in" /><p className="auth-switch">New to the exchange? <Link href="/sign-up">Create an account</Link></p></div></main> }
