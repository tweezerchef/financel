import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../../../lib/prisma/prisma'
import { getSignedAvatarUrl } from '../../../lib/aws/getSignedAvatarUrl'

function extractS3Key(url: string): string {
  const match = url.match(/amazonaws\.com\/(.+)/)
  return match ? match[1] : url
}
export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json()
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${credential}`,
        },
      }
    )

    const payload = await response.json()
    if (!payload?.email)
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        password: true,
        avatar: true,
        username: true,
      },
    })

    if (!user) {
      const newUser = await prisma.user.create({
        data: { email: payload.email, password: '' },
      })
      return NextResponse.json(
        {
          id: newUser.id,
          type: 'unregistered',
          message: 'Register to continue',
        },
        { status: 200 } // Changed from 100 to 200 for standard success response
      )
    }

    const { id, avatar, username } = user
    let signedUrl = null
    let signedUrlExpiration = null
    if (avatar) {
      const s3Key = extractS3Key(avatar)
      const { signedUrl: url, expiresAt } = await getSignedAvatarUrl(s3Key)
      signedUrl = url
      signedUrlExpiration = expiresAt
    }

    const result = await prisma.result.upsert({
      where: { userId_date: { userId: user.id, date: new Date() } },
      update: {},
      create: { userId: user.id, date: new Date() },
      include: {
        categories: {
          orderBy: {
            category: 'asc',
          },
        },
      },
    })

    const resultId = result.id
    const categoryOrder = ['INTEREST_RATE', 'CURRENCY', 'STOCK']
    const nextCategory =
      categoryOrder.find((category) => {
        const categoryResult = result.categories.find(
          (c) => c.category === category
        )
        return !categoryResult || !categoryResult.completed
      }) || null

    // Generate a new session ID
    const sessionId = uuidv4()

    // Generate a refresh token
    const refreshToken = uuidv4()

    // Create the session
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        refreshToken,
      },
    })

    const cookieStore = await cookies()
    cookieStore.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({
      googleId: payload.id,
      id,
      type: 'registered',
      resultId,
      nextCategory,
      username,
      signedAvatarUrl: signedUrl,
      signedAvatarExpiration: signedUrlExpiration,
      message: 'Logged in successfully',
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login.' },
      { status: 500 }
    )
  }
}
