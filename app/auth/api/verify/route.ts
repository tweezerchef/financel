import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface DecodedToken {
  id: string
  type: 'guest' | 'registered'
  resultId: string
  iat: number
  exp: number
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    if (!token)
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 400 }
      )

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken

    // Return relevant information from the decoded token
    return NextResponse.json({
      message: 'Token is valid',
      user: {
        id: decoded.id,
        type: decoded.type,
        resultId: decoded.resultId,
      },
    })
  } catch (error) {
    console.error('Token verification failed:', error)
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
