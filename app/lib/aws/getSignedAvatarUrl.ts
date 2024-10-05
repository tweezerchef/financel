import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.SERVER_AWS_REGION,
  credentials: {
    accessKeyId: process.env.SERVER_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SERVER_AWS_SECRET_ACCESS_KEY!,
  },
})

export async function getSignedAvatarUrl(avatarKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.SERVER_AWS_S3_BUCKET_NAME,
    Key: avatarKey,
  })

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    })
    return signedUrl
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw new Error('Failed to generate signed URL for avatar')
  }
}
