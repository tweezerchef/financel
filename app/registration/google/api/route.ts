/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { getSignedAvatarUrl } from '../../../lib/aws/getSignedAvatarUrl'
import { updateUserAvatar } from '../../../lib/dbFunctions/updateUserAvatar'

import prisma from '../../../lib/prisma/prisma'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const username = formData.get('username') as string
    const id = formData.get('id') as string
    const avatarType = formData.get('avatarType') as string
    const googleId = formData.get('googleId') as string
    const s3Client = new S3Client({
      region: process.env.SERVER_AWS_REGION,
      credentials: {
        accessKeyId: process.env.SERVER_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.SERVER_AWS_SECRET_ACCESS_KEY!,
      },
    })
    const password = googleId || id || ''
    const hashedPassword = await bcrypt.hash(password, 10)
    // Create the user
    const newUser = await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        username,
      },
    })
    const userId = newUser.id
    if (avatarType === 'uploaded') {
      const file = formData.get('avatar') as File
      const fileExtension = file.name.split('.').pop()
      // Handle S3 upload for custom avatar
      const fileName = `${uuidv4()}.${fileExtension}`
      const key = `avatars/${userId}/${fileName}`

      const command = new PutObjectCommand({
        Bucket: process.env.SERVER_AWS_S3_BUCKET_NAME,
        Key: key,
        Body: Buffer.from(await file.arrayBuffer()),
        ContentType: file.type,
      })
      await s3Client.send(command)

      const avatarS3 = `https://${process.env.SERVER_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`

      // Update user with S3 URL
      await prisma.user.update({
        where: { id },
        data: {
          username,
          avatarS3,
          avatarUrl: null, // Clear any existing preset avatar
        },
      })
    } else {
      // Handle preset avatar
      const avatarUrl = formData.get('avatarUrl') as string

      // Update user with preset avatar URL
      await prisma.user.update({
        where: { id },
        data: {
          username,
          avatarUrl,
          avatarS3: null, // Clear any existing uploaded avatar
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
