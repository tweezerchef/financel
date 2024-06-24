import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
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

  /// email validation will be added here
  // we need to hash the password
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
