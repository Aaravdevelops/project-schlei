import type { EnvironmentalStatus } from './environmental-data'

export type RssItem = { id: string; title: string; link: string; description: string | null; source: string; publishedAt: string | null; fetchedAt: string; sourceType: 'rss' }
export type RssFeedResult = { name: string; status: EnvironmentalStatus; lastChecked: string; detail: string; items: RssItem[] }

const timeoutMs = 8000
function text(xml: string, tag: string) { const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i')); return match?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim() || null }
function items(xml: string) { return [...xml.matchAll(/<(item|entry)(?:\s[^>]*)?>([\s\S]*?)<\/(?:item|entry)>/gi)].map(([, , block]) => { const title = text(block, 'title'); const link = text(block, 'link') || block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || ''; const publishedAt = text(block, 'pubDate') || text(block, 'published') || text(block, 'updated'); return title && /^https?:\/\//i.test(link) ? { title, link, description: text(block, 'description') || text(block, 'summary'), publishedAt: publishedAt && !Number.isNaN(Date.parse(publishedAt)) ? new Date(publishedAt).toISOString() : null } : null }).filter(Boolean) as { title: string; link: string; description: string | null; publishedAt: string | null }[] }
export async function readRssFeeds(): Promise<{ feeds: RssFeedResult[]; updates: RssItem[] }> {
  const configured = (process.env.RSS_FEED_URLS || '').split(',').map((url) => url.trim()).filter(Boolean)
  const now = new Date().toISOString()
  if (!configured.length) return { feeds: [{ name: 'Publications / RSS', status: 'unavailable', lastChecked: now, detail: 'RSS_FEED_URLS is not configured.', items: [] }], updates: [] }
  const uniqueUrls = [...new Set(configured)]
  const results = await Promise.all(uniqueUrls.map(async (url) => {
    let name = 'Configured RSS feed'
    try {
      const parsedUrl = new URL(url)
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Only HTTP(S) feeds are supported.')
      name = parsedUrl.hostname
      const response = await fetch(parsedUrl, { signal: AbortSignal.timeout(timeoutMs), headers: { accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' }, cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const xml = await response.text()
      if (xml.length > 2_000_000) throw new Error('Feed response is too large.')
      const parsed = items(xml).slice(0, 50)
      if (!parsed.length) return { name, status: 'error' as const, lastChecked: now, detail: 'Feed returned no valid publication entries.', items: [] }
      const fetchedAt = now
      return { name, status: 'available' as const, lastChecked: now, detail: `${parsed.length} publication${parsed.length === 1 ? '' : 's'} available.`, items: parsed.map((item) => ({ ...item, id: item.link, source: name, fetchedAt, sourceType: 'rss' as const })) }
    } catch (error) {
      return { name, status: 'error' as const, lastChecked: now, detail: error instanceof Error ? error.message : 'Feed could not be read.', items: [] }
    }
  }))
  const seen = new Set<string>(); const updates = results.flatMap((feed) => feed.items).filter((item) => !seen.has(item.id) && seen.add(item.id)).sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || '')).slice(0, 12)
  return { feeds: results, updates }
}
