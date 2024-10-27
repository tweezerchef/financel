// ... imports remain the same ...
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '../../../../lib/prisma/prisma'

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

export async function GET() {
  try {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))

    const leaderboard = (await prisma.leaderboard.findFirst({
      where: {
        type: 'TODAY',
        category: 'FINAL',
        startDate: startOfDay,
        endDate: startOfDay,
      },
      include: {
        entries: {
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
          orderBy: {
            score: 'desc',
          },
        },
      },
      orderBy: {
        lastCalculated: 'desc',
      },
    })) as LeaderboardWithEntries | null

    if (!leaderboard)
      return NextResponse.json(
        { error: 'No final leaderboard found for today' },
        { status: 404 }
      )

    const updatedEntries = await Promise.all(
      leaderboard.entries.map(async (entry, index) => {
        if (entry.rank !== index + 1)
          await prisma.leaderboardEntry.update({
            where: { id: entry.id },
            data: { rank: index + 1 },
          })

        return {
          rank: index + 1,
          score: entry.score.toNumber(),
          username: entry.result.user?.username || 'Guest',
          avatar: entry.result.user?.avatar || null,
          isGuest: !entry.result.user,
        }
      })
    )

    await prisma.leaderboard.update({
      where: { id: leaderboard.id },
      data: { totalParticipants: updatedEntries.length },
    })

    const response = {
      totalParticipants: updatedEntries.length,
      entries: updatedEntries,
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
