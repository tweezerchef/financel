import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma/prisma'
import { getChartDataForInterestRate } from '../../../../lib/dbFunctions/getChartDataForInterestRate'

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
        interestRate: {
          select: {
            rateType: {
              select: {
                category: true,
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

    const chartData = await getChartDataForInterestRate({
      dailyChallengeId: dailyChallenge.id,
    })

    const response = {
      date: dailyChallenge.date.date,
      category: dailyChallenge.interestRate.rateType.category,
      chartData,
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
