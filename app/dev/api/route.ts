// app/api/chartData/route.ts
import { NextResponse } from 'next/server'
import { getChartDataForDailyChallenge } from '../../lib/dbFunctions/getChartDataForDailyChallenge'

export async function GET() {
  try {
    const chartData = await getChartDataForDailyChallenge()
    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching chart data:', error)
    return NextResponse.json(
      { error: 'Error fetching chart data' },
      { status: 500 }
    )
  }
}
