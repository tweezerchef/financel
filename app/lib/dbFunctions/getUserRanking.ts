import { LeaderboardCategory } from '@prisma/client'
import prisma from '../prisma/prisma'

export async function getUserRanking(
  resultId: string,
  category: LeaderboardCategory
) {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))

  // Use our optimized index on [type, category, startDate]
  const leaderboard = await prisma.leaderboard.findUnique({
    where: {
      type_category_startDate: {
        type: 'TODAY',
        category,
        startDate: startOfDay,
      },
    },
  })

  if (!leaderboard)
    return {
      rank: null,
      totalParticipants: 0,
    }

  // Use our index on [leaderboardId, resultId]
  const entry = await prisma.leaderboardEntry.findUnique({
    where: {
      leaderboardId_resultId: {
        leaderboardId: leaderboard.id,
        resultId,
      },
    },
    select: {
      rank: true,
      leaderboard: {
        select: {
          totalParticipants: true,
        },
      },
    },
  })

  return {
    rank: entry?.rank ?? null,
    totalParticipants: leaderboard.totalParticipants,
  }
}
