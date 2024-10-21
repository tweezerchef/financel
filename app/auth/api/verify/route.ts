import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '../../../lib/prisma/prisma'
import { getSignedAvatarUrl } from '../../../lib/aws/getSignedAvatarUrl'

export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!refreshToken)
      return NextResponse.json(
        { message: 'No refresh token provided' },
        { status: 401 }
      )

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as jwt.JwtPayload

    let userData

    if (decoded.type === 'registered')
      userData = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      })
    else if (decoded.type === 'guest')
      userData = await prisma.guest.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
        },
      })

    if (!userData)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })

    // Fetch the latest result for the user
    const latestResult = await prisma.result.findFirst({
      where: { userId: decoded.userId },
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

    if (
      decoded.type === 'registered' &&
      'avatar' in userData &&
      userData.avatar
    )
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
      type: decoded.type,
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
