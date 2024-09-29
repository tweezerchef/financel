import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma/prisma'

export async function GET() {
  let dailyChallenge

  try {
    dailyChallenge = await prisma.dailyChallenge.findFirst({
      orderBy: { challengeDate: 'desc' },
      select: {
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

    // Transform the data to return only date and category
    const response = {
      date: dailyChallenge.date.date,
      category: dailyChallenge.interestRate.rateType.category,
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
