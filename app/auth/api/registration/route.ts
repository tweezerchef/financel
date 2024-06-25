/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { uuid } from 'uuidv4'
import prisma from '../../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  const { email, password, username } = await req.json()
  // Check if the user already exists
  const user = await prisma.user.findUnique({
    where: { email },
  })
  if (user)
    return NextResponse.json(
      { message: 'User already exists with this email address.' },
      { status: 400 }
    )
  const emailToken = uuid()
  /// email validation will be added here
  const hashedPassword = await bcrypt.hash(password, 10)
  // Create the user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  })
  return NextResponse.json({ newUser, message: 'User created successfully' })
}
