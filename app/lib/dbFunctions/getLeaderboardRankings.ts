import prisma from '../prisma/prisma'

export async function getLeaderboardRankings(resultId: string) {
  const today = new Date()
  const startOfDay = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0)
  )
  const endOfDay = new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    )
  )

  // First, find today's leaderboard
  const leaderboard = await prisma.leaderboard.findFirst({
    where: {
      type: 'TODAY',
      startDate: startOfDay,
      endDate: endOfDay,
    },
  })

  if (!leaderboard)
    return {
      rank: 0,
      totalParticipants: 0,
    }

  const entry = await prisma.leaderboardEntry.findFirst({
    where: {
      leaderboardId: leaderboard.id,
      resultId,
    },
  })

  if (!entry)
    return {
      rank: 0,
      totalParticipants: leaderboard.totalParticipants,
    }

  return {
    rank: entry.rank,
    totalParticipants: leaderboard.totalParticipants,
  }
}
