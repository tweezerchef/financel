/* eslint-disable no-restricted-syntax */
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

    let result = await prisma.result.findFirst({
      where: { guestId: guest.id, date: dateOnly },
      include: {
        categories: {
          orderBy: {
            category: 'asc',
          },
        },
      },
    })

    if (!result)
      result = await prisma.result.create({
        data: { guestId: guest.id, date: dateOnly },
        include: {
          categories: {
            orderBy: {
              category: 'asc',
            },
          },
        },
      })

    await prisma.guestPlay.create({
      data: { guestId: guest.id },
    })

    await prisma.guest.update({
      where: { id: guest.id },
      data: { lastPlay: new Date() },
    })

    const { id } = guest
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

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return NextResponse.json({
      token,
      id,
      resultId,
      nextCategory,
      message: 'Logged in as guest successfully',
    })
  } catch (error) {
    console.error('Error in guest login:', error)
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}
