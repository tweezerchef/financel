import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma/prisma'

export async function GET() {
  let dailyChallenge
  try {
    dailyChallenge = await prisma.dailyChallenge.findFirst({
      orderBy: { challengeDate: 'desc' },
      select: {
        date: true,
        interestRate: {
          select: {
            rateType: true,
          },
        },
      },
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { message: 'Error fetching daily challenge' },
      { status: 500 }
    )
  }

  return NextResponse.json({ dailyChallenge }, { status: 200 })
}
