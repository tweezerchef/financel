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

    if (avatarType === 'uploaded') {
      const file = formData.get('avatar') as File
      // Handle S3 upload for custom avatar
      const s3Client = new S3Client({ region: process.env.AWS_REGION })
      const fileName = `${id}-${Date.now()}-${file.name}`

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: Buffer.from(await file.arrayBuffer()),
          ContentType: file.type,
        })
      )

      const avatarS3 = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

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
