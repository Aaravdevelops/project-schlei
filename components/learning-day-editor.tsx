'use client'

import { useState, useTransition } from 'react'
import { saveLearningDay } from '@/app/actions/learning-days'

export function LearningDayEditor({ day, initialTitle, initialBody, initialImageUrl, initialImageAlt }: { day: number; initialTitle: string; initialBody: string; initialImageUrl: string | null; initialImageAlt: string | null }) {
  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)
  const [imageUrl, setImageUrl] = useState(initialImageUrl ?? '')
  const [imageAlt, setImageAlt] = useState(initialImageAlt ?? '')
  const [message, setMessage] = useState('')
  const [pending, startTransition] = useTransition()
  async function uploadImage(file: File) { const form = new FormData(); form.append('file', file); form.append('title', title || `Day ${day} image`); form.append('site', `Learning day ${day}`); const response = await fetch('/api/media/upload', { method: 'POST', body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Upload failed'); setImageUrl(`/api/media/file?pathname=${encodeURIComponent(result.pathname)}`); setMessage('Image uploaded. Save the day to publish it.') }
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); startTransition(async () => { try { await saveLearningDay(day, title, body, imageUrl || null, imageAlt || null); setMessage('Saved successfully.') } catch { setMessage('Could not save this day.') } }) }
  return <form className="learning-editor" onSubmit={submit}><label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required /></label><label>Text<textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={20000} rows={10} placeholder="Add what happened, what you learned, and what you noticed..." /></label><label>Upload image<input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file).catch(() => setMessage('Could not upload this image.')) }} /></label><label>Or use image URL<input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} type="url" placeholder="Paste a secure image URL" /></label><label>Image description<input value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} maxLength={200} placeholder="Describe the image" /></label><button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save day'}</button>{message && <p role="status">{message}</p>}</form>
}
