import { NextResponse } from 'next/server'
import { createDailyFakeScores } from '../../../lib/dbFunctions/createDailyFakeScores'

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('Cron job running')

  try {
    await createDailyFakeScores()
    return NextResponse.json(
      { message: 'Cron job ran successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { message: 'An error occurred during the cron job' },
      { status: 500 }
    )
  }
}
