import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('sessionId')?.value

    if (!sessionId)
      return NextResponse.json({ message: 'No session found' }, { status: 401 })

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { guest: true },
    })

    if (!session || new Date() > session.expiresAt)
      return NextResponse.json(
        { message: 'Invalid or expired session' },
        { status: 401 }
      )

    // Extend session
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    if (!session.guest)
      return NextResponse.json({ message: 'Guest not found' }, { status: 404 })

    return NextResponse.json({
      id: session.guest.id,
      type: 'guest',
    })
  } catch (error) {
    console.error('Error in session verification:', error)
    return NextResponse.json(
      { message: 'An error occurred during session verification' },
      { status: 500 }
    )
  }
}
