import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

const places = {
  'schlei-fjord': { number: '01', name: 'Schlei fjord', region: 'Schleswig-Holstein · Germany', intro: 'A living fjord where saltwater, freshwater and human care meet.', body: 'Along the Schlei, students read the shoreline as a connected system. Water samples, reed beds and careful observations reveal how small changes shape an entire habitat.', question: 'What can the shoreline tell us before we take a sample?' },
  'geomar-kiel': { number: '02', name: 'GEOMAR Kiel', region: 'Kiel · Germany', intro: 'Science makes the invisible visible.', body: 'At GEOMAR, field questions become measurements. Students explored how researchers use samples and shared tools to understand the health of the sea and the life it supports.', question: 'Which hidden story is waiting inside a drop of water?' },
  'wadden-sea': { number: '03', name: 'Wadden Sea', region: 'North Sea coast · Germany', intro: 'A landscape shaped by tide, time and movement.', body: 'The Wadden Sea changes every day. Its mudflats, salt marshes and tidal channels provide a powerful lesson in resilience and the importance of protecting spaces that are always in motion.', question: 'How does a changing landscape stay alive?' },
  'sylt-dunes': { number: '04', name: 'Sylt dunes', region: 'Sylt · Germany', intro: 'Dunes hold the line between land and sea.', body: 'On Sylt, students followed the quiet work of dune grasses. Their roots hold sand in place, creating shelter for an ecosystem built to withstand wind, waves and movement.', question: 'What protects a place when the ground is always shifting?' },
  haithabu: { number: '05', name: 'Haithabu', region: 'Schleswig · Germany', intro: 'A place where history meets the water.', body: 'Haithabu connects the field route to the past. Its position beside the Schlei reminds us that waterways have always carried ideas, people and responsibility across borders.', question: 'What can an old meeting place teach us about shared futures?' },
} as const

export default async function FieldStopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const place = places[slug as keyof typeof places] ?? places['schlei-fjord']

  return <main className="field-page">
    <Link href="/#route" className="field-back"><ArrowLeft size={15} /> Back to the field route</Link>
    <div className="field-page-grid">
      <div><p className="kicker clay-text">Field stop · {place.number} / 05</p><h1>{place.name}</h1><p className="field-region">{place.region}</p></div>
      <div className="field-copy"><p className="field-intro">{place.intro}</p><p>{place.body}</p><div className="field-question"><span>Shared question</span><strong>{place.question}</strong></div><Link className="field-next" href="/#route">Explore another stop <ArrowUpRight size={15} /></Link></div>
    </div>
  </main>
}

export function generateStaticParams() { return Object.keys(places).map((slug) => ({ slug })) }
