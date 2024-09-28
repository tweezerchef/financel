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
    })
    if (!user)
      return NextResponse.json(
        { message: 'User does not exist with this email address.' },
        { status: 400 }
      )
    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect)
      return NextResponse.json(
        { message: 'Password is incorrect.' },
        { status: 400 }
      )
    const { id } = user
    let result = await prisma.result.findFirst({
      where: { userId: id, date: dateOnly },
    })
    if (!result)
      result = await prisma.result.create({
        data: { userId: id, date: dateOnly },
      })
    const resultId = result.id
    // Create a token
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined')

    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    return NextResponse.json({
      token,
      id,
      resultId,
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
