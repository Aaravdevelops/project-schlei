'use client'

import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import type { EnvironmentalSnapshot } from '@/lib/environmental-data'

export function EnvironmentalStatus({ snapshot }: { snapshot: EnvironmentalSnapshot }) {
  const router = useRouter()
  return <section className="environmental-status" aria-labelledby="environmental-status-title">
    <div className="status-heading"><div><p className="kicker green-text">Environmental data</p><h2 id="environmental-status-title">Trust before <em>display.</em></h2><p>Measurements stay hidden until a verified source is connected. Publications are never presented as sensor readings.</p></div><button className="outline-button" onClick={() => router.refresh()}><RefreshCw size={14} /> Refresh status</button></div>
    <div className="status-grid">{snapshot.readings.map((reading) => <article className="status-card" key={reading.id}><div className="status-card-top"><span>{reading.label}</span><strong className={`status-pill ${reading.status}`}>{reading.status}</strong></div><b className="status-value">{reading.value ?? 'Unavailable'}</b><small>{reading.note}</small><footer>{reading.source} · {reading.sourceType}{reading.sourceUrl && <>{' · '}<a href={reading.sourceUrl} target="_blank" rel="noreferrer">Source</a></>}</footer></article>)}</div>
    <div className="feed-list"><h3>Source and feed status</h3>{snapshot.feeds.map((feed) => <div className="feed-row" key={feed.name}><span><strong>{feed.name}</strong><small>{feed.detail}</small></span><span className={`status-pill ${feed.status}`}>{feed.status}</span></div>)}</div>
    {snapshot.updates.length > 0 && <div className="feed-list updates-list"><h3>Recent publications</h3>{snapshot.updates.map((update) => <a className="feed-row update-row" href={update.link} target="_blank" rel="noreferrer" key={update.id}><span><strong>{update.title}</strong><small>{update.source} · Publication, not a sensor measurement</small></span><span className="status-pill available">Open</span></a>)}</div>}<p className="status-checked">Last checked {new Date(snapshot.checkedAt).toLocaleString('en-GB')}</p>
  </section>
}
