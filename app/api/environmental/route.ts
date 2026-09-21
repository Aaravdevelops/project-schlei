import { NextResponse } from 'next/server'
import { getEnvironmentalSnapshot } from '@/lib/environmental-data'

export async function GET() {
  const snapshot = await getEnvironmentalSnapshot()
  return NextResponse.json(snapshot, { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' } })
}
