import { NextResponse } from 'next/server'
import { importStocks } from './importStocks'

export async function GET() {
  try {
    const result = await importStocks()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: 'Error populating stocks', error },
      { status: 500 }
    )
  }
}
