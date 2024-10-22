import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { OAuth2Client } from 'google-auth-library'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../../../lib/prisma/prisma'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json()
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload?.email)
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    })

    if (!user)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })

    // Create session
    const sessionId = uuidv4()
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        refreshToken: uuidv4(), // Add this line
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { message: 'Authentication failed' },
      { status: 500 }
    )
  }
}
