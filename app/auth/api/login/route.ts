import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../api/auth/[...nextauth]/authOptions'
import { prisma } from '../../../lib/prisma/prisma'
import { getSignedAvatarUrl } from '../../../lib/aws/getSignedAvatarUrl'

// Helper functions (inferContentType and extractS3Key) remain unchanged
function extractS3Key(url: string): string {
  const match = url.match(/amazonaws\.com\/(.+)/)
  return match ? match[1] : url
}
function inferContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'webp':
      return 'image/webp'
    default:
      return 'application/octet-stream' // Default to binary data if unknown
  }
}
export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user)
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      )

    const userId = session.user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        avatar: true,
        username: true,
      },
    })

    if (!user)
      return NextResponse.json({ message: 'User not found' }, { status: 404 })

    const { id, avatar, username } = user
    let signedUrl = null
    let signedUrlExpiration = null
    if (avatar) {
      const s3Key = extractS3Key(avatar)
      signedUrl = await getSignedAvatarUrl(s3Key, inferContentType(s3Key))
      signedUrlExpiration = Date.now() + 3600 * 1000 // 1 hour from now
    }

    const today = new Date()
    const dateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )

    const result = await prisma.result.upsert({
      where: { userId_date: { userId: id, date: dateOnly } },
      update: {},
      create: { userId: id, date: dateOnly },
      include: {
        categories: {
          orderBy: {
            category: 'asc',
          },
        },
      },
    })

    const resultId = result.id
    // Determine the next uncompleted category
    const categoryOrder = ['INTEREST_RATE', 'CURRENCY', 'STOCK']
    const nextCategory =
      categoryOrder.find((category) => {
        const categoryResult = result.categories.find(
          (c) => c.category === category
        )
        return !categoryResult || !categoryResult.completed
      }) || null

    return NextResponse.json({
      id,
      resultId,
      nextCategory,
      signedAvatarUrl: signedUrl,
      signedAvatarExpiration: signedUrlExpiration,
      username,
      message: 'Logged in successfully',
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'An error occurred during login.' },
      { status: 500 }
    )
  }
}
