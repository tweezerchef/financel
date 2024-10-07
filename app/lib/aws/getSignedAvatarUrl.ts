import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.SERVER_AWS_REGION,
  credentials: {
    accessKeyId: process.env.SERVER_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SERVER_AWS_SECRET_ACCESS_KEY!,
  },
})

export async function getSignedAvatarUrl(
  key: string,
  contentType: string
): Promise<string> {
  const params = {
    Bucket: process.env.SERVER_AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  }

  try {
    const command = new GetObjectCommand(params)
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    })
    return signedUrl
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw new Error('Failed to generate signed URL for avatar upload')
  }
}
