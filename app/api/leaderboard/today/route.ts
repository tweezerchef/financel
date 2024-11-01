import { NextResponse, NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '../../../lib/prisma/prisma'

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

export async function GET(request: NextRequest) {
  try {
    // Get today's date range
    const { searchParams } = new URL(request.url)
    const startOfDay = searchParams.get('startDate')
    if (!startOfDay)
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      )

    // Get today's leaderboard
    const leaderboard = (await prisma.leaderboard.findFirst({
      where: {
        type: 'TODAY',
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
                    avatarS3: true,
                    avatarUrl: true,
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
    })) as LeaderboardWithEntries | null

    if (!leaderboard)
      return NextResponse.json(
        { error: 'No leaderboard found for today' },
        { status: 404 }
      )

    // Update ranks in database and prepare response
    const updatedEntries = await Promise.all(
      leaderboard.entries.map(
        async (
          entry: Prisma.LeaderboardEntryGetPayload<{
            include: {
              result: {
                include: {
                  user: {
                    select: {
                      username: true
                      avatarS3: true
                      avatarUrl: true
                    }
                  }
                  guest: true
                }
              }
            }
          }>,

          index: number
        ) => {
          // Update rank in database if it's different
          if (entry.rank !== index + 1)
            await prisma.leaderboardEntry.update({
              where: { id: entry.id },
              data: { rank: index + 1 },
            })

          return {
            rank: index + 1,
            score: entry.score.toNumber(),
            username: entry.result.user?.username || 'Guest',
            avatarS3: entry.result.user?.avatarS3 || null,
            avatarUrl: entry.result.user?.avatarUrl || null,
            isGuest: !entry.result.user,
          }
        }
      )
    )

    // Update total participants
    await prisma.leaderboard.update({
      where: { id: leaderboard.id },
      data: { totalParticipants: updatedEntries.length },
    })

    const response = {
      totalParticipants: updatedEntries.length,
      entries: updatedEntries,
      lastCalculated: leaderboard.lastCalculated,
    }

    console.log('API Response:', response) // Debug log

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
