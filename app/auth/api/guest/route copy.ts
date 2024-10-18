/* eslint-disable no-restricted-syntax */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../lib/prisma/prisma'

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

    // Combine guest find/create and result find/create operations
    const [guest, result] = await prisma.$transaction(async (prisma) => {
      const guest = await prisma.guest.upsert({
        where: { ip },
        update: { lastPlay: new Date() },
        create: { ip, lastPlay: new Date() },
      })

      const result = await prisma.result.upsert({
        where: { guestId_date: { guestId: guest.id, date: dateOnly } },
        update: {},
        create: { guestId: guest.id, date: dateOnly },
        include: {
          categories: {
            orderBy: { category: 'asc' },
          },
        },
      })

      return [guest, result]
    })

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

    const token = jwt.sign({ id: guest.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    console.log('token', token)
    return NextResponse.json({
      token,
      id: guest.id,
      resultId: result.id,
      nextCategory,
      message: 'Logged in as guest successfully',
    })
  } catch (error) {
    console.error('Error in guest login:', error)
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}
