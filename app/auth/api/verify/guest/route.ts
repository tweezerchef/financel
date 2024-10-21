import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import prisma from '../../../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
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

    if (decoded.type !== 'guest')
      return NextResponse.json(
        { message: 'Invalid token type' },
        { status: 401 }
      )

    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId },
    })

    if (
      !session ||
      session.refreshToken !== refreshToken ||
      new Date() > session.expiresAt
    )
      return NextResponse.json(
        { message: 'Invalid or expired session' },
        { status: 401 }
      )

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, type: 'guest', sessionId: decoded.sessionId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, type: 'guest', sessionId: decoded.sessionId },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    )

    await prisma.session.update({
      where: { id: decoded.sessionId },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    const refreshTokenCookie = serialize('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    // Fetch the guest data
    const guest = await prisma.guest.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        // Add any other fields you need
      },
    })

    if (!guest)
      return NextResponse.json({ message: 'Guest not found' }, { status: 404 })

    return NextResponse.json(
      {
        token: newAccessToken,
        id: guest.id,
        type: 'guest',
        // Add any other guest data you need to return
      },
      {
        headers: {
          'Set-Cookie': refreshTokenCookie,
        },
      }
    )
  } catch (error) {
    console.error('Error in token refresh:', error)
    return NextResponse.json(
      { message: 'An error occurred during token refresh' },
      { status: 500 }
    )
  }
}
