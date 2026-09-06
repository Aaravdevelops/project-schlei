export type EnvironmentalSourceType = 'measurement' | 'official-api' | 'rss' | 'news' | 'cache'
export type EnvironmentalStatus = 'available' | 'unavailable' | 'stale' | 'error'

export type EnvironmentalReading = {
  id: string
  label: string
  value: string | null
  unit: string | null
  source: string
  sourceType: EnvironmentalSourceType
  status: EnvironmentalStatus
  fetchedAt: string | null
  publishedAt: string | null
  note: string
}

export type EnvironmentalSnapshot = {
  checkedAt: string
  readings: EnvironmentalReading[]
  feeds: { name: string; sourceType: EnvironmentalSourceType; status: EnvironmentalStatus; lastChecked: string; detail: string }[]
  updates: { title: string; source: string; publishedAt: string | null; sourceType: EnvironmentalSourceType }[]
}

export async function getEnvironmentalSnapshot(): Promise<EnvironmentalSnapshot> {
  const checkedAt = new Date().toISOString()
  return {
    checkedAt,
    readings: [
      { id: 'ph', label: 'pH level', value: null, unit: null, source: 'No connected measurement source', sourceType: 'measurement', status: 'unavailable', fetchedAt: null, publishedAt: null, note: 'Not displayed until a verified measurement is available.' },
      { id: 'clarity', label: 'Clarity', value: null, unit: null, source: 'No connected measurement source', sourceType: 'measurement', status: 'unavailable', fetchedAt: null, publishedAt: null, note: 'Not displayed until a verified measurement is available.' },
      { id: 'microplastics', label: 'Microplastics', value: null, unit: null, source: 'No connected measurement source', sourceType: 'measurement', status: 'unavailable', fetchedAt: null, publishedAt: null, note: 'Not displayed until a verified measurement is available.' },
    ],
    feeds: [
      { name: 'Verified sensor feed', sourceType: 'measurement', status: 'unavailable', lastChecked: checkedAt, detail: 'No sensor endpoint configured.' },
      { name: 'Official datasets', sourceType: 'official-api', status: 'unavailable', lastChecked: checkedAt, detail: 'No official API endpoint configured.' },
      { name: 'Publications / RSS', sourceType: 'rss', status: 'unavailable', lastChecked: checkedAt, detail: 'No feed endpoint configured.' },
    ],
    updates: [],
  }
}
