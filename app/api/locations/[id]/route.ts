import { NextResponse } from 'next/server'
import { getLocationById } from '@/lib/actions/locations'

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 })
  }

  const location = await getLocationById(id)
  if (!location) {
    return NextResponse.json({ error: 'Lokasi tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json(location)
}

