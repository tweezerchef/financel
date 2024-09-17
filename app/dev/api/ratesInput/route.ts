import { NextResponse } from 'next/server'
import { importInterestRates } from './importInterestRates'

export async function POST() {
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
