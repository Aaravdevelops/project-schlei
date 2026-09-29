import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

const places = {
  'schlei-fjord': { number: '01', name: 'Schlei fjord', region: 'Schleswig-Holstein · Germany', intro: 'A living fjord where saltwater, freshwater and human care meet.', body: 'Along the Schlei, students read the shoreline as a connected system. Water samples, reed beds and careful observations reveal how small changes shape an entire habitat.', question: 'What can the shoreline tell us before we take a sample?' },
  'geomar-kiel': { number: '02', name: 'GEOMAR Kiel', region: 'Kiel · Germany', intro: 'Science makes the invisible visible.', body: 'At GEOMAR, field questions become measurements. Students explored how researchers use samples and shared tools to understand the health of the sea and the life it supports.', question: 'Which hidden story is waiting inside a drop of water?' },
  'wadden-sea': { number: '03', name: 'Wadden Sea', region: 'North Sea coast · Germany', intro: 'A landscape shaped by tide, time and movement.', body: 'The Wadden Sea changes every day. Its mudflats, salt marshes and tidal channels provide a powerful lesson in resilience and the importance of protecting spaces that are always in motion.', question: 'How does a changing landscape stay alive?' },
  'sylt-dunes': { number: '04', name: 'Sylt dunes', region: 'Sylt · Germany', intro: 'Dunes hold the line between land and sea.', body: 'On Sylt, students followed the quiet work of dune grasses. Their roots hold sand in place, creating shelter for an ecosystem built to withstand wind, waves and movement.', question: 'What protects a place when the ground is always shifting?' },
  'wadden-sea-excursion': { number: '04', name: 'Wadden Sea', region: 'North Sea coast · Germany', intro: 'A landscape shaped by tide, time and movement.', body: 'The Wadden Sea changes every day. Its mudflats, salt marshes and tidal channels provide a powerful lesson in resilience and the importance of protecting spaces that are always in motion.', question: 'How does a changing landscape stay alive?' },
  'cheese-farm': { number: '05', name: 'Cheese farm', region: 'Schleswig-Holstein · Germany', intro: 'Agriculture can work with the land.', body: 'At the cheese farm, students explored how food production, soil, water and animal care connect. Local choices can help landscapes stay productive and healthy.', question: 'How can farming protect the ground that feeds us?' },
  'artenschutzzentrum-elmshorn': { number: '06', name: 'Artenschutzzentrum Elmshorn', region: 'Elmshorn · Germany', intro: 'Biodiversity begins with making room for life.', body: 'The Artenschutzzentrum Elmshorn shows how conservation turns observation into action, creating safer habitats for species that share our everyday landscapes.', question: 'What does a thriving habitat need from us?' },
  'garden-project': { number: '07', name: 'Garden Project', region: 'Shared future · Germany', intro: 'A garden is a small promise to the future.', body: 'The Garden Project turns learning into something tangible. Planting, tending and sharing a space gives students a practical way to carry the exchange forward.', question: 'What future can we grow together?' },
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
