import { NextResponse } from 'next/server'
import { importInterestRatesChunk } from './importInterestRatesChunks'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const offset = parseInt(searchParams.get('offset') || '0', 10)
  const limit = parseInt(searchParams.get('limit') || '100', 10)

  try {
    const result = await importInterestRatesChunk(offset, limit)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error during import', error },
      { status: 500 }
    )
  }
}
