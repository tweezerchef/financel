/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { getSignedAvatarUrl } from '../../lib/aws/getSignedAvatarUrl'
import { updateUserAvatar } from '../../lib/dbFunctions/updateUserAvatar'

import prisma from '../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const avatar = formData.get('avatar') as File

  // Check if avatar file exists first
  if (!avatar)
    return NextResponse.json(
      { message: 'Avatar file is required' },
      { status: 400 }
    )

  const s3Client = new S3Client({
    region: process.env.SERVER_AWS_REGION,
    credentials: {
      accessKeyId: process.env.SERVER_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.SERVER_AWS_SECRET_ACCESS_KEY!,
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

  try {
    const fileExtension = avatar.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const emailToken = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and upload avatar in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the user first
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      })

      const key = `avatars/${newUser.id}/${fileName}`
      const arrayBuffer = await avatar.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const command = new PutObjectCommand({
        Bucket: process.env.SERVER_AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: avatar.type,
      })

      await s3Client.send(command)

      const avatarUrl = `https://${process.env.SERVER_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
      const updatedUser = await prisma.user.update({
        where: { id: newUser.id },
        data: { avatarUrl },
      })

      const { signedUrl, expiresAt } = await getSignedAvatarUrl(key)

      return { updatedUser, avatarUrl, signedUrl, expiresAt }
    })

    return NextResponse.json({
      ...result,
      message: 'User created successfully and avatar uploaded',
    })
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { message: 'Error during registration process' },
      { status: 500 }
    )
  }
}
