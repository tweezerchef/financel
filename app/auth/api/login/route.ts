import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from '../../../lib/prisma/prisma'

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

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    return NextResponse.json({
      token,
      id,
      resultId,
      nextCategory,
      avatar,
      username,
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
