import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '../../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ip = req.headers.get('x-forwarded-for') || req.ip

    if (!ip)
      return NextResponse.json(
        { message: 'Unable to determine client IP' },
        { status: 400 }
      )

    let guest = await prisma.guest.findUnique({
      where: { ip },
      include: { plays: { orderBy: { playedAt: 'desc' }, take: 1 } },
    })

    if (!guest)
      guest = await prisma.guest.create({
        data: { ip },
        include: { plays: { orderBy: { playedAt: 'desc' }, take: 1 } },
      })
    console.log(guest)
    // const today = new Date()
    // today.setHours(0, 0, 0, 0)

    // const lastPlay = guest.plays[0]
    // if (lastPlay && lastPlay.playedAt >= today)
    //   return NextResponse.json(
    //     { message: 'You have already played today as a guest.' },
    //     { status: 400 }
    //   )

    // Create a new play record
    await prisma.guestPlay.create({
      data: { guestId: guest.id },
    })

    // Update the lastPlay field of the guest
    await prisma.guest.update({
      where: { id: guest.id },
      data: { lastPlay: new Date() },
    })
    const { id } = guest

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return NextResponse.json({
      token,
      id,
      message: 'Logged in as guest successfully',
    })
  } catch (error) {
    console.error('Guest login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during guest login.' },
      { status: 500 }
    )
  }
}
