import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getLearningDay, getLearningDayEditor } from '@/lib/learning-days'
import { DAY_COUNT } from '@/lib/learning-day-constants'
import { LearningDayEditor } from '@/components/learning-day-editor'

export async function generateStaticParams() { return Array.from({ length: DAY_COUNT }, (_, index) => ({ day: String(index + 1) })) }

export default async function LearningDayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day: rawDay } = await params
  const day = Number(rawDay)
  if (!Number.isInteger(day) || day < 1 || day > DAY_COUNT) notFound()
  const entry = (await getLearningDay(day))!
  const current = await auth.api.getSession({ headers: await headers() })
  let canEdit = false
  if (current?.user) { try { await getLearningDayEditor(day); canEdit = true } catch {} }
  return <main className="learning-day-page"><Link className="back-link" href="/#learning-days">← All days</Link><div className="learning-day-heading"><p className="section-kicker">Field journal · Day {day}</p><h1>{entry.title}</h1></div>{entry.imageUrl && <figure><img src={entry.imageUrl} alt={entry.imageAlt || `Learning exchange, day ${day}`} /><figcaption>{entry.imageAlt || `Day ${day} field image`}</figcaption></figure>}<article className="learning-day-body">{entry.body ? entry.body.split(/\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p className="empty-day">This day is ready for its first field note.</p>}</article>{canEdit && <LearningDayEditor day={day} initialTitle={entry.title} initialBody={entry.body} initialImageUrl={entry.imageUrl} initialImageAlt={entry.imageAlt} />}<nav className="day-pagination" aria-label="Day navigation">{day > 1 && <Link href={`/learning/day/${day - 1}`}>← Day {day - 1}</Link>}{day < DAY_COUNT && <Link href={`/learning/day/${day + 1}`}>Day {day + 1} →</Link>}</nav></main>
}
