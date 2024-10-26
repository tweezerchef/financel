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
  const categories = ['INTEREST_RATE', 'CURRENCY', 'STOCK', 'FINAL'] as const
  type Category = (typeof categories)[number]

  const avg: Record<Category, number> = {} as Record<Category, number>

  for (const category of categories) {
    const stat = await prisma.categoryStatistics.findUnique({
      where: { category },
    })
    avg[category] = stat ? Number(stat.totalScore) / stat.count : 0
  }

  return NextResponse.json({ message: 'Hello, world!' })
}
