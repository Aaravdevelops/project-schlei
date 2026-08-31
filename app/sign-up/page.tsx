import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'
export default function SignUp() { return <main className="auth-shell"><div className="auth-card"><p className="kicker green-text">Join the field team</p><h1>Make your<br /><em>mark.</em></h1><p>Create your account to share field observations with the exchange.</p><AuthForm mode="sign-up" /><p className="auth-switch">Already registered? <Link href="/sign-in">Sign in</Link></p></div></main> }
