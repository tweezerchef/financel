/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '../../../../lib/prisma/prisma'

export async function GET() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('sessionId')?.value

  if (!sessionId)
    return NextResponse.json(
      { message: 'No session ID provided' },
      { status: 401 }
    )

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  })

  if (!session)
    return NextResponse.json({ message: 'Invalid session' }, { status: 401 })

  const categories = ['INTEREST_RATE', 'CURRENCY', 'STOCK'] as const
  type Category = (typeof categories)[number]

  const categoryAverages: { category: Category; average: number }[] = []
  let finalAverage = 0

  for (const category of categories) {
    const stat = await prisma.categoryStatistics.findUnique({
      where: { category },
    })
    const average = stat ? Number(stat.totalScore) / stat.count : 0
    categoryAverages.push({ category, average })
  }

  const finalStat = await prisma.categoryStatistics.findUnique({
    where: { category: 'FINAL' },
  })
  finalAverage = finalStat ? Number(finalStat.totalScore) / finalStat.count : 0

  return NextResponse.json({
    categoryAverages,
    finalAverage,
  })
}
