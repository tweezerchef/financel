/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { uuid } from 'uuidv4'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { updateUserAvatar } from '../../lib/dbFunctions/updateUserAvatar'

import prisma from '../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const avatar = formData.get('avatar') as File

  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
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
  const userId = newUser.id
  const filename = `${userId}`
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `avatars/${userId}`,
    Body: new Uint8Array(await avatar.arrayBuffer()),
    ContentType: avatar.type,
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

  const avatarUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/avatars/${filename}`

  const updatedUser = await updateUserAvatar(userId, avatarUrl)

  return NextResponse.json({
    updatedUser,
    message: 'User created successfully',
  })
}
