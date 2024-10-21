import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../../../lib/prisma/prisma'
import { getSignedAvatarUrl } from '../../../lib/aws/getSignedAvatarUrl'

// Helper function to infer content type from file extension
function inferContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'webp':
      return 'image/webp'
    default:
      return 'application/octet-stream' // Default to binary data if unknown
  }
}

function extractS3Key(url: string): string {
  const match = url.match(/amazonaws\.com\/(.+)/)
  return match ? match[1] : url
}

interface Req extends NextRequest {
  json(): Promise<{ email: string; password: string }>
}

export async function POST(req: Req) {
  const today = new Date()
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  try {
    const { email, password } = await req.json()
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        avatar: true,
        username: true,
      },
    })
    if (!user || !(await bcrypt.compare(password, user.password)))
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 400 }
      )

    const { id, avatar, username } = user
    let signedUrl = null
    let signedUrlExpiration = null
    if (avatar) {
      const s3Key = extractS3Key(avatar)
      signedUrl = await getSignedAvatarUrl(s3Key, inferContentType(s3Key))
      signedUrlExpiration = Date.now() + 3600 * 1000 // 1 hour from now
    }

    const result = await prisma.result.upsert({
      where: { userId_date: { userId: user.id, date: dateOnly } },
      update: {},
      create: { userId: user.id, date: dateOnly },
      include: {
        categories: {
          orderBy: {
            category: 'asc',
          },
        },
      },
    })

    const resultId = result.id
    // Determine the next uncompleted category
    const categoryOrder = ['INTEREST_RATE', 'CURRENCY', 'STOCK']
    const nextCategory =
      categoryOrder.find((category) => {
        const categoryResult = result.categories.find(
          (c) => c.category === category
        )
        return !categoryResult || !categoryResult.completed
      }) || null

    // Create a token
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')

    // Generate a session ID
    const sessionId = uuidv4()

    // Create a short-lived JWT (e.g., 15 minutes)
    const token = jwt.sign({ id, sessionId }, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    })

    // Create a long-lived refresh token (e.g., 7 days)
    const refreshToken = jwt.sign(
      { id, sessionId },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '7d' }
    )

    // Store session data in the database
    await prisma.session.create({
      data: {
        id: sessionId,
        userId: id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    })

    // Set the refresh token as an HTTP-only cookie
    const refreshTokenCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json(
      {
        token,
        id,
        resultId,
        nextCategory,
        signedAvatarUrl: signedUrl,
        signedAvatarExpiration: signedUrlExpiration,
        username,
        message: 'Logged in successfully',
      },
      {
        headers: {
          'Set-Cookie': refreshTokenCookie,
        },
      }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login.' },
      { status: 500 }
    )
  }
}
