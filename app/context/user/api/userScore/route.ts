import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import prisma from '../../../../lib/prisma/prisma'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value
    const resultId = req.nextUrl.searchParams.get('resultId')

    if (!sessionId)
      return NextResponse.json(
        { message: 'No session ID provided' },
        { status: 401 }
      )

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true, guest: true },
    })

    if (!session)
      return NextResponse.json({ message: 'Invalid session' }, { status: 401 })

    const userData = session.user || session.guest

    if (!userData)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })

    const userType = session.user ? 'registered' : 'guest'

    // Fetch the latest result for the user
    const latestResult = await prisma.result.findFirst({
      where: {
        [userType === 'registered' ? 'userId' : 'guestId']: userData.id,
        ...(resultId ? { id: resultId } : {}),
      },
      select: {
        id: true,
        score: true,
        categories: {
          select: {
            category: true,
            score: true,
          },
        },
      },
    })

    return NextResponse.json({
      id: userData.id,
      type: userType,
      finalScore: latestResult?.score || null,
      categoryScores:
        latestResult?.categories.map((cat) => ({
          category: cat.category,
          score: cat.score,
        })) || [],
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching user data' },
      { status: 500 }
    )
  }
}
