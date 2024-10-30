/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-use-before-define */
import type { LeaderboardCategory } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import prisma from '../prisma/prisma'

export async function calculateDailyLeaderboard() {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))

  // Leverage our indexes by doing the sorting in the database
  const allResults = await prisma.result.findMany({
    where: {
      date: startOfDay,
      OR: [
        { interestRateScore: { gt: new Decimal(0) } },
        { currencyScore: { gt: new Decimal(0) } },
        { stockScore: { gt: new Decimal(0) } },
        { score: { gt: new Decimal(0) } },
      ],
    },
    orderBy: [
      { interestRateScore: 'desc' },
      { currencyScore: 'desc' },
      { stockScore: 'desc' },
      { score: 'desc' },
    ],
    select: {
      id: true,
      interestRateScore: true,
      currencyScore: true,
      stockScore: true,
      score: true,
    },
  })

  // Process all categories in parallel using a single transaction
  await prisma.$transaction(async (tx) => {
    await Promise.all([
      processLeaderboard(
        'INTEREST_RATE',
        startOfDay,
        allResults.filter(
          (r) => r.interestRateScore?.gt(new Decimal(0)) ?? false
        ),
        tx
      ),
      processLeaderboard(
        'CURRENCY',
        startOfDay,
        allResults.filter((r) => r.currencyScore?.gt(new Decimal(0)) ?? false),
        tx
      ),
      processLeaderboard(
        'STOCK',
        startOfDay,
        allResults.filter((r) => r.stockScore?.gt(new Decimal(0)) ?? false),
        tx
      ),
      processLeaderboard(
        'FINAL',
        startOfDay,
        allResults.filter((r) => r.score.gt(new Decimal(0))),
        tx
      ),
    ])
  })
}

async function processLeaderboard(
  category: LeaderboardCategory,
  startOfDay: Date,
  categoryResults: any[],
  tx: any
) {
  const leaderboard = await tx.leaderboard.upsert({
    where: {
      type_category_startDate: {
        type: 'TODAY',
        category,
        startDate: startOfDay,
      },
    },
    create: {
      type: 'TODAY',
      category,
      startDate: startOfDay,
      endDate: startOfDay,
    },
    update: {
      lastCalculated: new Date(),
    },
  })

  // Sort results by score in descending order
  const sortedResults = categoryResults.sort((a, b) => {
    const scoreA = Number(
      category === 'INTEREST_RATE'
        ? a.interestRateScore
        : category === 'CURRENCY'
          ? a.currencyScore
          : category === 'STOCK'
            ? a.stockScore
            : a.score
    )
    const scoreB = Number(
      category === 'INTEREST_RATE'
        ? b.interestRateScore
        : category === 'CURRENCY'
          ? b.currencyScore
          : category === 'STOCK'
            ? b.stockScore
            : b.score
    )
    return scoreB - scoreA
  })

  // Assign ranks with proper tie handling
  let currentRank = 1
  let currentScore: number | null = null
  let sameRankCount = 0

  const entries = sortedResults.map((result, index) => {
    const score = Number(
      category === 'INTEREST_RATE'
        ? result.interestRateScore
        : category === 'CURRENCY'
          ? result.currencyScore
          : category === 'STOCK'
            ? result.stockScore
            : result.score
    )

    // If this is a new score, update the rank
    if (score !== currentScore) {
      currentRank = index + 1 - sameRankCount
      currentScore = score
      sameRankCount = 0
    } else sameRankCount++

    return {
      leaderboardId: leaderboard.id,
      resultId: result.id,
      rank: currentRank,
      score,
    }
  })

  // Batch operations within the transaction
  await Promise.all([
    tx.leaderboard.update({
      where: { id: leaderboard.id },
      data: { totalParticipants: categoryResults.length },
    }),
    tx.leaderboardEntry.deleteMany({
      where: { leaderboardId: leaderboard.id },
    }),
    tx.leaderboardEntry.createMany({
      data: entries,
    }),
  ])
}
