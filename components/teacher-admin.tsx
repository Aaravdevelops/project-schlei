'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { deleteTeacherUser } from '@/app/actions/teacher'

type TeacherUser = { id: string; name: string; email: string; createdAt: Date; role: string | null; school: string | null }

export function TeacherAdmin({ users, teacherId }: { users: TeacherUser[]; teacherId: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  function remove(target: TeacherUser) {
    if (!window.confirm(`Delete ${target.name} and all of their content? This cannot be undone.`)) return
    setError('')
    startTransition(async () => {
      try { await deleteTeacherUser(target.id); router.refresh() } catch { setError('Could not delete that user. Please try again.') }
    })
  }
  async function signOut() { await authClient.signOut(); router.push('/teacher-sign-in'); router.refresh() }
  return <section className="teacher-admin" aria-labelledby="teacher-admin-title">
    <div className="teacher-admin-head"><div><p className="kicker blue-text">Teacher workspace</p><h1 id="teacher-admin-title">People in the <em>exchange.</em></h1><p>Review every account and remove inactive users when needed.</p></div><div className="teacher-actions"><button className="outline-button" onClick={signOut}>Sign out</button><a className="outline-button" href="/">Back home</a></div></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="teacher-table-wrap"><table className="teacher-table"><caption className="sr-only">Exchange users</caption><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>School</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{users.map((item) => <tr key={item.id}><td><strong>{item.name}</strong>{item.id === teacherId && <span className="you-label">You</span>}</td><td>{item.email}</td><td><span className="role-chip">{item.role ?? 'student'}</span></td><td>{item.school || '—'}</td><td>{new Date(item.createdAt).toLocaleDateString('en-GB')}</td><td>{item.id !== teacherId && <button className="delete-user" disabled={pending} onClick={() => remove(item)}>Delete</button>}</td></tr>)}</tbody></table>{users.length === 0 && <p className="teacher-empty">No users found.</p>}</div>
  </section>
}
