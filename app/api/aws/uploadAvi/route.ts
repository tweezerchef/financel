import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import prisma from '../../../lib/prisma/prisma'

const s3Client = new S3Client({
  region: process.env.SERVER_AWS_REGION,
  credentials: {
    accessKeyId: process.env.SERVER_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SERVER_AWS_SECRET_ACCESS_KEY!,
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const email = formData.get('email') as string | null

  if (!file)
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  if (!email)
    return NextResponse.json({ error: 'No email provided' }, { status: 400 })

  const fileName = `avatars/${Date.now()}-${file.name}`

  const command = new PutObjectCommand({
    Bucket: process.env.SERVER_AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: await file.arrayBuffer().then(Buffer.from),
    ContentType: file.type,
  })

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  })

  try {
    // Upload file to S3
    await s3Client.send(command)

    // Update user's avatar in the database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { avatar: fileName },
    })

    if (!updatedUser)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json(
      { url: signedUrl, avatar: fileName },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error uploading file or updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
