import { NextResponse } from 'next/server'
import { createDailyChallenge } from '../../lib/dbFunctions/dailyChallengeInterest'

export async function GET() {
  console.log('Cron job running')

  try {
    await createDailyChallenge()
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
