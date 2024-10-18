import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
// import { Session } from 'next-auth'
import { prisma } from '../../../lib/prisma/prisma'
import { authOptions } from '../../../api/auth/[...nextauth]/authOptions'

// Add this type declaration at the top of your file
declare module 'next-auth' {
  interface Session {
    guest?: { id: string }
  }
}

export async function POST(req: NextRequest) {
  const today = new Date()
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()

    if (!ip)
      return NextResponse.json(
        { message: 'Unable to determine client IP' },
        { status: 400 }
      )

    const [guest, result, session] = await prisma.$transaction(
      async (prisma) => {
        const guest = await prisma.guest.upsert({
          where: { ip },
          update: { lastPlay: new Date() },
          create: { ip, lastPlay: new Date() },
        })

        const result = await prisma.result.upsert({
          where: { guestId_date: { guestId: guest.id, date: dateOnly } },
          update: {},
          create: { guestId: guest.id, date: dateOnly },
          include: {
            categories: {
              orderBy: { category: 'asc' },
            },
          },
        })

        const session = await prisma.session.create({
          data: {
            guestId: guest.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            sessionToken:
              Math.random().toString(36).substring(2, 15) +
              Math.random().toString(36).substring(2, 15),
          },
        })

        return [guest, result, session]
      }
    )

    const categoryOrder = ['INTEREST_RATE', 'CURRENCY', 'STOCK']
    const nextCategory =
      categoryOrder.find(
        (category) =>
          !result.categories.find((c) => c.category === category && c.completed)
      ) || null

    return NextResponse.json({
      sessionToken: session.sessionToken,
      id: guest.id,
      resultId: result.id,
      nextCategory,
      message: 'Logged in as guest successfully',
    })
  } catch (error) {
    console.error('Error in guest login:', error)
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session)
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  if (!session.user?.id && !session.guest?.id)
    return NextResponse.json({ message: 'Invalid session' }, { status: 400 })

  const userId = session.user?.id
  const guestId = session.guest?.id

  try {
    const result = await prisma.result.findFirst({
      where: userId ? { userId } : { guestId },
      orderBy: { date: 'desc' },
      include: { categories: true },
    })

    if (!result)
      return NextResponse.json({ message: 'No result found' }, { status: 404 })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching result:', error)
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}
