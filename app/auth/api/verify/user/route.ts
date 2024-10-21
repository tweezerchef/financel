import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import prisma from '../../../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  try {
    // Get the refresh token from the cookie
    const refreshToken = req.cookies.get('refreshToken')?.value

    if (!refreshToken)
      return NextResponse.json(
        { message: 'No refresh token provided' },
        { status: 401 }
      )

    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as jwt.JwtPayload

    if (decoded.type !== 'registered')
      return NextResponse.json(
        { message: 'Invalid token type' },
        { status: 401 }
      )

    // Check if the session exists and is valid
    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId },
      include: { user: true },
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

    // Generate a new access token
    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        type: 'registered',
        sessionId: decoded.sessionId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )

    // Optionally, you can also refresh the refresh token
    const newRefreshToken = jwt.sign(
      {
        userId: decoded.userId,
        type: 'registered',
        sessionId: decoded.sessionId,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    )

    // Update the session in the database
    await prisma.session.update({
      where: { id: decoded.sessionId },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    })

    // Set the new refresh token as a cookie
    const refreshTokenCookie = serialize('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    // Fetch the user data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        // Add any other fields you need
      },
    })

    if (!user)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })

    // Return the new access token and set the new refresh token cookie
    return NextResponse.json(
      {
        token: newAccessToken,
        id: user.id,
        type: 'registered',
        username: user.username,
        // Add any other user data you need to return
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
