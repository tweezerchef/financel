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
  const avatar = formData.get('avatar') as File | null
  const avatarUrl = formData.get('avatarUrl') as string | null
  const avatarType = formData.get('avatarType') as 'uploaded' | 'preset'

  if (!avatar && !avatarUrl)
    return NextResponse.json(
      { message: 'Avatar is required (either file or preset URL)' },
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
    const emailToken = uuidv4()
    const hashedPassword = await bcrypt.hash(password, 10)

    let avatarS3: string | null = null
    let finalAvatarUrl: string | null = null
    let key: string | undefined

    // Handle different avatar types
    if (avatarType === 'uploaded' && avatar) {
      const fileExtension = avatar.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExtension}`
      key = `avatars/${emailToken}/${fileName}`
      const arrayBuffer = await avatar.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const command = new PutObjectCommand({
        Bucket: process.env.SERVER_AWS_S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: avatar.type,
      })

      await s3Client.send(command)
      avatarS3 = `https://${process.env.SERVER_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
    } else if (avatarType === 'preset' && avatarUrl) finalAvatarUrl = avatarUrl

    // Create user with the appropriate avatar URL
    const result = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          avatarUrl: finalAvatarUrl, // Store preset URL here
          avatarS3, // Store uploaded S3 URL here
        },
      })

      return {
        user: newUser,
        avatarUrl: avatarS3 || finalAvatarUrl,
        signedUrl:
          avatarType === 'uploaded' && key
            ? await getSignedAvatarUrl(key)
            : null,
      }
    })

    return NextResponse.json({
      ...result,
      message: 'User created successfully',
    })
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { message: 'Error during registration process' },
      { status: 500 }
    )
  }
}
