/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import prisma from '../../../lib/prisma/prisma'
import { getSignedAvatarUrl } from '../../../lib/aws/getSignedAvatarUrl'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value

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
      },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        categories: {
          orderBy: { category: 'asc' },
          select: { category: true, completed: true },
        },
      },
    })

    const nextCategory =
      latestResult?.categories.find((c) => !c.completed)?.category || null

    let signedAvatarUrl = null
    let signedAvatarExpiration = null

    if (userType === 'registered' && 'avatar' in userData && userData.avatar)
      if (
        typeof userData.avatar === 'string' &&
        userData.avatar.trim() !== ''
      ) {
        const { signedUrl, expiresAt } = await getSignedAvatarUrl(
          userData.avatar
        )
        signedAvatarUrl = signedUrl
        signedAvatarExpiration = expiresAt
      }

    return NextResponse.json({
      id: userData.id,
      type: userType,
      resultId: latestResult?.id || null,
      nextCategory,
      username: 'username' in userData ? userData.username : null,
      signedAvatarUrl,
      signedAvatarExpiration,
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching user data' },
      { status: 500 }
    )
  }
}
