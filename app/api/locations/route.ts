import { NextResponse } from 'next/server'
import { getApprovedLocations } from '@/lib/actions/locations'

export async function GET() {
  try {
    const data = await getApprovedLocations()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

