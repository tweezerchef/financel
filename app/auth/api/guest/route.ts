import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '../../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  const today = new Date()
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()

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

    let result = await prisma.result.findFirst({
      where: { guestId: guest.id, date: dateOnly },
    })
    if (!result)
      result = await prisma.result.create({
        data: { guestId: guest.id, date: dateOnly },
      })

    console.log(result)

    await prisma.guestPlay.create({
      data: { guestId: guest.id },
    })

    // Update the lastPlay field of the guest
    await prisma.guest.update({
      where: { id: guest.id },
      data: { lastPlay: new Date() },
    })
    const { id } = guest
    const resultId = result.id

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return NextResponse.json({
      token,
      id,
      resultId,
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
