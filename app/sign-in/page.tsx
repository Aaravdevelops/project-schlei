import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'
export default function SignIn() { return <main className="auth-shell"><div className="auth-card"><p className="kicker blue-text">Nature Beyond Borders</p><h1>Welcome<br /><em>back.</em></h1><p>Sign in to open your student or teacher workspace.</p><AuthForm mode="sign-in" /><p className="auth-switch">New to the exchange? <Link href="/sign-up">Create an account</Link></p></div></main> }
