/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { uuid } from 'uuidv4'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getSignedAvatarUrl } from '../../lib/aws/getSignedAvatarUrl'
import { updateUserAvatar } from '../../lib/dbFunctions/updateUserAvatar'

import prisma from '../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const avatar = formData.get('avatar') as File

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
  const fileExtension = avatar.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExtension}`
  const key = `avatars/${userId}/${fileName}`

  try {
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
    const updatedUser = await updateUserAvatar(userId, avatarUrl)
    const { signedUrl, expiresAt } = await getSignedAvatarUrl(key)

    return NextResponse.json({
      updatedUser,
      avatarUrl,
      signedUrl,
      signedUrlExpiration: expiresAt,
      message: 'User created successfully and avatar uploaded',
    })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json(
      { message: 'Error uploading avatar' },
      { status: 500 }
    )
  }
}
