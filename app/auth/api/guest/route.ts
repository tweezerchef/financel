/* eslint-disable no-restricted-syntax */
import { NextRequest, NextResponse } from 'next/server'
// import jwt from 'jsonwebtoken'
// import { serialize } from 'cookie'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'
import prisma from '../../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    let guest = await prisma.guest.findUnique({ where: { ip } })

    if (!guest)
      guest = await prisma.guest.create({
        data: { ip },
      })

    const today = new Date()
    const dateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )

    const result = await prisma.result.upsert({
      where: { guestId_date: { guestId: guest.id, date: dateOnly } },
      update: {},
      create: { guestId: guest.id, date: dateOnly },
      include: {
        categories: {
          orderBy: {
            category: 'asc',
          },
        },
      },
    })

    // Generate a new session ID
    const sessionId = uuidv4()

    // Generate a refresh token
    const refreshToken = uuidv4()

    // Create the session
    await prisma.session.create({
      data: {
        id: sessionId,
        guestId: guest.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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

    // Determine the next uncompleted category
    const categoryOrder = ['INTEREST_RATE', 'CURRENCY', 'STOCK']
    const nextCategory =
      categoryOrder.find((category) => {
        const categoryResult = result.categories.find(
          (c) => c.category === category
        )
        return !categoryResult || !categoryResult.completed
      }) || null

    return NextResponse.json({
      id: guest.id,
      type: 'guest',
      resultId: result.id,
      nextCategory,
      message: 'Logged in as guest successfully',
    })
  } catch (error) {
    console.error('Error in guest login:', error)
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}
