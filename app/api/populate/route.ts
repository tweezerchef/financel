import { NextResponse } from 'next/server'
import { importInterestRates } from '../../dev/api/ratesInput/importInterestRates'

export async function GET() {
  try {
    await importInterestRates()
    return NextResponse.json({ message: 'Import completed successfully' })
  } catch (error) {
    return NextResponse.json(
      { message: 'Error during import', error },
      { status: 500 }
    )
  }
}
