import { LeaderboardCategory } from '@prisma/client'
import prisma from '../prisma/prisma'

export async function getUserRanking(resultId: string, category: string) {
  // First, get the leaderboard for the given category and date
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))

  const leaderboard = await prisma.leaderboard.findFirst({
    where: {
      type: 'TODAY',
      category: category.toUpperCase() as LeaderboardCategory,
      startDate: startOfDay,
      endDate: startOfDay,
    },
  })

  if (!leaderboard)
    return {
      rank: null,
      totalParticipants: 0,
    }

  // Now, find the leaderboard entry for the user in this leaderboard
  const entry = await prisma.leaderboardEntry.findUnique({
    where: {
      leaderboardId_resultId: {
        leaderboardId: leaderboard.id,
        resultId,
      },
    },
    include: {
      leaderboard: {
        select: {
          totalParticipants: true,
        },
      },
    },
  })

  return {
    rank: entry?.rank ?? null,
    totalParticipants: entry?.leaderboard.totalParticipants ?? 0,
  }
}
