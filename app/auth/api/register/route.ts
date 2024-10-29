import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import prisma from '../../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string
    const avatarType = formData.get('avatarType') as 'uploaded' | 'preset'

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser)
      return NextResponse.json(
        {
          message:
            existingUser.email === email
              ? 'Email already registered'
              : 'Username already taken',
        },
        { status: 400 }
      )

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    let avatarS3 = null
    let avatarUrl = null

    if (avatarType === 'uploaded') {
      const file = formData.get('avatar') as File
      if (!file)
        return NextResponse.json(
          { message: 'Avatar file is required' },
          { status: 400 }
        )

      // Upload to S3
      const s3Client = new S3Client({ region: process.env.AWS_REGION })
      const fileName = `${Date.now()}-${file.name}`

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: Buffer.from(await file.arrayBuffer()),
          ContentType: file.type,
        })
      )

      avatarS3 = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
    } else {
      // Handle preset avatar
      avatarUrl = formData.get('avatarUrl') as string
      if (!avatarUrl)
        return NextResponse.json(
          { message: 'Avatar URL is required' },
          { status: 400 }
        )
    }

    // Create user with appropriate avatar field
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        avatarS3,
        avatarUrl,
      },
    })

    return NextResponse.json({
      message: 'Registration successful',
      userId: user.id,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
