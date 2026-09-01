'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const router = useRouter()
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    const data = new FormData(e.currentTarget)
    try {
      const result = mode === 'sign-up'
        ? await authClient.signUp.email({ name: String(data.get('name')), email: String(data.get('email')), password: String(data.get('password')) })
        : await authClient.signIn.email({ email: String(data.get('email')), password: String(data.get('password')) })
      if (result.error) setError('We could not complete that request. Check your details and try again.')
      else { router.push('/dashboard'); router.refresh() }
    } catch {
      setError('We could not reach the exchange. Please try again.')
    } finally {
      setBusy(false)
    }
  }
  return <form className="auth-form" onSubmit={submit}>{mode === 'sign-up' && <label>Your name<input name="name" required /></label>}<label>Email<input name="email" type="email" required /></label><label>Password<input name="password" type="password" minLength={8} required /></label>{error && <p className="form-error">{error}</p>}<button className="button button-dark" disabled={busy}>{busy ? 'Please wait…' : mode === 'sign-up' ? 'Create account' : 'Sign in'} <span>↗</span></button></form>
}
