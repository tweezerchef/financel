// ... imports remain the same ...
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '../../../../lib/prisma/prisma'
import { getSignedAvatarUrl } from '../../../../lib/aws/getSignedAvatarUrl'
import { extractS3Key } from '../../../../lib/aws/extractS3Key'

type LeaderboardWithEntries = Prisma.LeaderboardGetPayload<{
  include: {
    entries: {
      include: {
        result: {
          include: {
            user: {
              select: {
                username: true
                avatar: true
              }
            }
            guest: true
          }
        }
      }
    }
  }
}>

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const resultId = searchParams.get('resultId')

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))

    const leaderboard = await prisma.leaderboard.findUnique({
      where: {
        type_category_startDate: {
          type: 'TODAY',
          category: 'FINAL',
          startDate: startOfDay,
        },
      },
      include: {
        entries: {
          take: 10,
          orderBy: { score: 'desc' },
          include: {
            result: {
              include: {
                user: {
                  select: {
                    username: true,
                    avatar: true,
                  },
                },
                guest: true,
              },
            },
          },
        },
      },
    })

    if (!leaderboard)
      return NextResponse.json(
        { error: 'No final leaderboard found for today' },
        { status: 404 }
      )

    // Get user's surrounding entries if resultId is provided
    let surroundingEntries: LeaderboardWithEntries['entries'] = []
    if (resultId) {
      const userEntry = await prisma.leaderboardEntry.findUnique({
        where: {
          leaderboardId_resultId: {
            leaderboardId: leaderboard.id,
            resultId,
          },
        },
        select: { rank: true },
      })

      if (userEntry)
        surroundingEntries = await prisma.leaderboardEntry.findMany({
          where: {
            leaderboardId: leaderboard.id,
            rank: {
              gte: Math.max(1, userEntry.rank - 4),
              lte: userEntry.rank + 4,
            },
          },
          orderBy: { rank: 'asc' },
          include: {
            result: {
              include: {
                user: {
                  select: {
                    username: true,
                    avatar: true,
                  },
                },
                guest: true,
              },
            },
          },
        })
    }

    // Process entries to add signed URLs
    const processEntries = async (
      entries: LeaderboardWithEntries['entries']
    ) => {
      return Promise.all(
        entries.map(async (entry) => {
          let signedUrl = null
          if (entry.result.user?.avatar) {
            const s3Key = extractS3Key(entry.result.user.avatar)
            const { signedUrl: url } = await getSignedAvatarUrl(s3Key)
            signedUrl = url
          } else
            signedUrl =
              'https://financle.s3.us-east-2.amazonaws.com/app/favicon.svg'

          return {
            rank: entry.rank,
            score: entry.score.toNumber(),
            username: entry.result.user?.username || 'Guest',
            avatar: signedUrl,
            isGuest: !entry.result.user,
          }
        })
      )
    }

    const topEntries = await processEntries(leaderboard.entries)
    const userSurroundingEntries = await processEntries(surroundingEntries)

    const response = {
      totalParticipants: leaderboard.totalParticipants,
      topEntries,
      surroundingEntries: userSurroundingEntries,
      lastCalculated: leaderboard.lastCalculated,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching final leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
