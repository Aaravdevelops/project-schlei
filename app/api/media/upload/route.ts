import { put } from '@vercel/blob'
import { NextResponse, type NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { media } from '@/lib/db/schema'

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await request.formData()
  const file = form.get('file') as File | null
  const title = String(form.get('title') || '').trim()
  const site = String(form.get('site') || 'Schlei').trim()
  const description = String(form.get('description') || '').trim()
  if (!file || !title || file.size > 50 * 1024 * 1024) return NextResponse.json({ error: 'Please add a title and a file under 50MB.' }, { status: 400 })
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return NextResponse.json({ error: 'Only photos and videos are supported.' }, { status: 400 })

  const blob = await put(`media/${session.user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`, file, { access: 'private' })
  await db.insert(media).values({ userId: session.user.id, title, description, pathname: blob.pathname, kind: file.type.startsWith('video/') ? 'video' : 'photo', site })
  return NextResponse.json({ success: true })
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.select().from(media).orderBy(media.createdAt)
  return NextResponse.json({ media: rows.filter((item) => item.userId === session.user.id) })
}
