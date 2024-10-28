import { calculateDailyLeaderboard } from './calculateDailyLeaderboard'
import { getLeaderboardRankings } from './getLeaderboardRankings'
import prisma from '../prisma/prisma'

export async function updateLeaderboardAfterFinal(resultId: string) {
  try {
    // Verify the result has a completed FINAL category
    const result = await prisma.result.findUnique({
      where: { id: resultId },
      include: {
        categories: {
          where: {
            category: 'FINAL',
            completed: true,
          },
        },
      },
    })

    if (!result || result.categories.length === 0)
      throw new Error('Final category not completed')

    // Calculate/update the leaderboard
    await calculateDailyLeaderboard()

    // Return the user's ranking
    return getLeaderboardRankings(resultId)
  } catch (error) {
    console.error('Error updating leaderboard:', error)
    throw error
  }
}
