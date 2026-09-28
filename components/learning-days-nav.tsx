import Link from 'next/link'
import { DAY_COUNT } from '@/lib/learning-day-constants'

export function LearningDaysNav() { return <section className="learning-days" aria-labelledby="learning-days-title"><p className="section-kicker">Field journal · 14 days</p><h2 id="learning-days-title">Learning by being there</h2><p>Choose a day to explore the exchange. Teachers can add notes and images; everyone can read the shared field story.</p><div className="learning-day-grid">{Array.from({ length: DAY_COUNT }, (_, index) => { const day = index + 1; return <Link className="learning-day-button" href={`/learning/day/${day}`} key={day}><span>Day</span><strong>{day}</strong><span aria-hidden="true">↗</span></Link> })}</div></section> }
