import { NextResponse } from 'next/server'
import { getChartDataForCurrency } from '../../../lib/dbFunctions/getChartDataForCurrency'
import prisma from '../../../lib/prisma/prisma'

export async function GET() {
  try {
    const dailyChallenge = await prisma.dailyChallenge.findFirst({
      orderBy: { challengeDate: 'desc' },
      select: {
        id: true,
        date: {
          select: {
            date: true,
          },
        },
        currencyValue: {
          select: {
            value: true,
            currency: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (!dailyChallenge)
      return NextResponse.json(
        { message: 'No daily challenge found' },
        { status: 404 }
      )

    const chartData = await getChartDataForCurrency({
      dailyChallengeId: dailyChallenge.id,
    })

    // Calculate the range of values in chartData
    const values = chartData.map((point) => point.currency)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue

    // Process the currency value
    const currencyValue = dailyChallenge.currencyValue?.value.toString() || ''
    const decimalPosition = currencyValue.indexOf('.') + 1

    const response = {
      date: dailyChallenge.date.date,
      currency: dailyChallenge.currencyValue?.currency.name,
      chartData,
      decimalPosition,
      range,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (e) {
    console.error('Error fetching daily challenge:', e)
    return NextResponse.json(
      { message: 'Error fetching daily challenge' },
      { status: 500 }
    )
  }
}
