import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { updateUserAvatar } from '../../../lib/dbFunctions/updateUserAvatar'

export const runtime = 'nodejs' // This line is crucial

export async function POST(request: Request) {
  try {
    const { filename, contentType, userId } = await request.json()

    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    })

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `avatars/${filename}`,
      ContentType: contentType,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    // Update user's avatar in the database
    const avatarUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/avatars/${filename}`
    await updateUserAvatar(userId, avatarUrl)

    return NextResponse.json({ url: signedUrl, avatarUrl })
  } catch (error) {
    console.error('Error in upload process:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
}
