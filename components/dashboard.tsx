'use client'

import { useMemo, useRef, useState } from 'react'
import { Check, ExternalLink, FileImage, FileVideo, FolderOpen, ImagePlus, Link2, Loader2, LogOut, Play, Plus, Sparkles, Upload, X } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type MediaItem = { id: number; title: string; description: string | null; pathname: string; kind: string; site: string; createdAt: Date | string }

type DashboardProps = { user: { name: string; email: string }; isTeacher: boolean }

const sites = ['Schlei', 'Wadden Sea', 'GEOMAR Kiel', 'Sylt dunes', 'School garden', 'Yamuna']

export function Dashboard({ user, isTeacher }: DashboardProps) {
  const [tab, setTab] = useState<'create' | 'catalogue'>( 'create')
  const [source, setSource] = useState<'upload' | 'link'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [site, setSite] = useState('Schlei')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [items, setItems] = useState<MediaItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const canPost = Boolean(title.trim() && (source === 'upload' ? file : link.trim()))
  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : link.trim(), [file, link])

  async function loadItems() {
    const res = await fetch('/api/media/upload', { cache: 'no-store' })
    if (res.ok) setItems((await res.json()).media ?? [])
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canPost || busy) return
    setBusy(true); setMessage('')
    const form = new FormData()
    form.set('title', title.trim()); form.set('site', site); form.set('description', description.trim())
    if (source === 'upload' && file) form.set('file', file)
    if (source === 'link') form.set('sourceUrl', link.trim())
    const res = await fetch('/api/media/upload', { method: 'POST', body: form })
    setMessage(res.ok ? 'Added to your catalogue.' : (await res.json()).error || 'Could not publish this moment.')
    if (res.ok) { setFile(null); setLink(''); setTitle(''); setDescription(''); await loadItems(); setTab('catalogue') }
    setBusy(false)
  }

  function chooseFile(next: File | undefined) {
    if (!next) return
    if (!next.type.startsWith('image/') && !next.type.startsWith('video/')) { setMessage('Choose an image or video file.'); return }
    setFile(next); setSource('upload'); setMessage('')
  }

  return <main className="portal-shell">
    <header className="portal-header"><a className="brand" href="/"><span className="brand-mark">≈</span><span>Nature<br /><i>Beyond Borders</i></span></a><div className="portal-user"><span>{user.name}</span><button onClick={async () => { await authClient.signOut(); location.href = '/sign-in' }}><LogOut size={15} /> Sign out</button></div></header>
    <section className="portal-hero"><div><p className="kicker blue-text">Student workspace / 2026</p><h1>Make your<br /><em>moment visible.</em></h1><p>Build the shared catalogue from what you notice, test, and feel along the water.</p></div><div className="hero-orbit"><Sparkles size={20} /><span>{items.length || '—'}<small> moments shared</small></span></div></section>
    <nav className="workspace-tabs" aria-label="Workspace sections"><button className={tab === 'create' ? 'active' : ''} onClick={() => setTab('create')}><Plus size={16} /> New moment</button><button className={tab === 'catalogue' ? 'active' : ''} onClick={() => { setTab('catalogue'); loadItems() }}><FolderOpen size={16} /> My catalogue</button></nav>
    {tab === 'create' ? <section className="workspace-grid"><div className="upload-card"><p className="kicker green-text">Your field catalogue</p><h2>Share a<br /><em>moment.</em></h2><p className="card-intro">Every photo, clip, and observation gives the exchange another point of view.</p><form onSubmit={submit}>
      <label>Title <span>required</span><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Testing the Schlei" required /></label>
      <label>Site <select value={site} onChange={e => setSite(e.target.value)}>{sites.map(item => <option key={item}>{item}</option>)}</select></label>
      <div className="source-switch" role="tablist" aria-label="Choose media source"><button type="button" className={source === 'upload' ? 'active' : ''} onClick={() => setSource('upload')}><Upload size={15} /> Upload file</button><button type="button" className={source === 'link' ? 'active' : ''} onClick={() => setSource('link')}><Link2 size={15} /> Drive / Dropbox link</button></div>
      {source === 'upload' ? <div className={`drop-zone ${file ? 'has-file' : ''}`} onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); chooseFile(e.dataTransfer.files[0]) }}><input ref={inputRef} type="file" accept="image/*,video/*" hidden onChange={e => chooseFile(e.target.files?.[0])} />{file ? <><div className="file-icon">{file.type.startsWith('video/') ? <FileVideo /> : <FileImage />}</div><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(1)} MB · ready to share</small><button type="button" className="clear-file" onClick={e => { e.stopPropagation(); setFile(null) }} aria-label="Remove file"><X size={14} /></button></> : <><ImagePlus size={24} /><strong>Drop a photo or video here</strong><small>or browse from your device · max 50 MB</small></>}</div> : <label className="link-field">File link<input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://drive.google.com/..." /><small>Paste a share link from Google Drive or Dropbox.</small></label>}
      <label>Description <span>optional</span><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What did you notice?" rows={3} /></label><button className="publish-button" type="submit" disabled={!canPost || busy}>{busy ? <><Loader2 className="spin" size={17} /> Publishing</> : <><Play size={16} /> Add to catalogue</>}</button>{message && <p className={`form-message ${message.includes('Added') ? 'success' : 'error'}`} role="status">{message.includes('Added') && <Check size={15} />}{message}</p>}
    </form></div><aside className="preview-card"><p className="kicker">Live preview</p>{previewUrl ? <div className="media-preview">{source === 'upload' && file?.type.startsWith('video/') ? <video src={previewUrl} controls /> : source === 'link' ? <div className="link-preview"><Link2 size={28} /><span>Linked media</span><small>Preview will be available after publishing</small></div> : <img src={previewUrl} alt="Selected upload preview" />}</div> : <div className="empty-preview"><ImagePlus size={28} /><span>Your story will appear here</span></div>}<div className="preview-meta"><span>{site}</span><span>Nature Beyond Borders</span></div></aside></section> : <section className="catalogue-panel"><div className="section-heading"><div><p className="kicker green-text">Shared archive</p><h2>Your <em>catalogue.</em></h2></div><button className="outline-button" onClick={() => setTab('create')}><Plus size={16} /> Add moment</button></div>{items.length ? <div className="catalogue-grid">{items.map(item => <article className="catalogue-item" key={item.id}><div className="catalogue-thumb">{item.kind === 'video' ? <FileVideo size={23} /> : item.pathname.startsWith('http') ? <ExternalLink size={23} /> : <FileImage size={23} />}<span>{item.kind}</span></div><div><p className="item-site">{item.site}</p><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div></article>)}</div> : <div className="empty-catalogue"><FolderOpen size={32} /><h3>Nothing here yet.</h3><p>Your first field moment is one upload away.</p><button className="publish-button" onClick={() => setTab('create')}>Create your first post</button></div>}</section>}
    {isTeacher && <p className="teacher-note">Teacher tools are available in the teacher panel when enabled for your account.</p>}
  </main>
}
