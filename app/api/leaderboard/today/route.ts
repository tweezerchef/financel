import { NextResponse } from 'next/server'
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

export async function GET() {
  try {
    // Get today's date range
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    // Get today's leaderboard
    const leaderboard = (await prisma.leaderboard.findFirst({
      where: {
        type: 'TODAY',
        startDate: startOfDay,
        endDate: startOfDay, // Changed this to match exact day
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
        lastCalculated: 'desc', // Get the most recently calculated leaderboard
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
                      avatar: true
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
            avatar: entry.result.user?.avatar || null,
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
