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
  const sourceUrl = String(form.get('sourceUrl') || '').trim()
  const title = String(form.get('title') || '').trim()
  const site = String(form.get('site') || 'Schlei').trim()
  const description = String(form.get('description') || '').trim()
  if (!title || (!file && !sourceUrl) || (file && file.size > 50 * 1024 * 1024)) return NextResponse.json({ error: 'Please add a title and a file or link under 50MB.' }, { status: 400 })
  if (file && !file.type.startsWith('image/') && !file.type.startsWith('video/')) return NextResponse.json({ error: 'Only photos and videos are supported.' }, { status: 400 })
  if (sourceUrl && !/^https?:\/\//i.test(sourceUrl)) return NextResponse.json({ error: 'Please use a valid share link.' }, { status: 400 })

  const pathname = sourceUrl || (await put(`media/${session.user.id}/${Date.now()}-${file!.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`, file!, { access: 'private' })).pathname
  const lowerPath = `${sourceUrl} ${file?.type || ''}`.toLowerCase()
  const kind = lowerPath.includes('video') || /\.(mp4|mov|webm)(\?|$)/.test(lowerPath) ? 'video' : 'photo'
  await db.insert(media).values({ userId: session.user.id, title, description, pathname, kind, site })
  return NextResponse.json({ success: true })
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.select().from(media).orderBy(media.createdAt)
  return NextResponse.json({ media: rows.filter((item) => item.userId === session.user.id) })
}
