/* eslint-disable no-use-before-define */
import { NextRequest, NextResponse } from 'next/server'
import { getSignedAvatarUrl } from '../../../lib/aws/getSignedAvatarUrl'

export async function POST(req: NextRequest) {
  try {
    const { avatarKey } = await req.json()
    const { signedUrl, expiresAt } = await getSignedAvatarUrl(avatarKey)

    return NextResponse.json({ signedUrl, expiresAt })
  } catch (error) {
    console.error('Error refreshing avatar URL:', error)
    return NextResponse.json(
      { error: 'Failed to refresh avatar URL' },
      { status: 500 }
    )
  }
}

// function inferContentType(filename: string): string {
//   const ext = filename.split('.').pop()?.toLowerCase()
//   switch (ext) {
//     case 'jpg':
//     case 'jpeg':
//       return 'image/jpeg'
//     case 'png':
//       return 'image/png'
//     case 'gif':
//       return 'image/gif'
//     case 'webp':
//       return 'image/webp'
//     default:
//       return 'application/octet-stream'
//   }
// }
