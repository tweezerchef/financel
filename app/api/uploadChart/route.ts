import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'

const s3Client = new S3Client({
  region: process.env.SERVER_AWS_REGION,
  credentials: {
    accessKeyId: process.env.SERVER_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SERVER_AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('sessionId')?.value || 'anonymous'

    const formData = await req.formData()
    const file = formData.get('chart') as File
    if (!file)
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())

    const fileExtension = 'png'
    const timestamp = Date.now()
    const fileName = `${sessionId}_${timestamp}_${uuidv4()}.${fileExtension}`
    const key = `chart/${fileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.SERVER_AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // ACL option removed
    })

    await s3Client.send(command)

    const imageUrl = `https://${process.env.SERVER_AWS_S3_BUCKET_NAME}.s3.${process.env.SERVER_AWS_REGION}.amazonaws.com/${key}`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}
