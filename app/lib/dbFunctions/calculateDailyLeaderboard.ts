/* eslint-disable no-use-before-define */
import type {
  Result,
  ResultCategory,
  LeaderboardCategory,
} from '@prisma/client'
import prisma from '../prisma/prisma'

export async function calculateDailyLeaderboard() {
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0))

  // Calculate leaderboards for each category
  await Promise.all([
    calculateCategoryLeaderboard('INTEREST_RATE', startOfDay),
    calculateCategoryLeaderboard('CURRENCY', startOfDay),
    calculateCategoryLeaderboard('STOCK', startOfDay),
    calculateCategoryLeaderboard('FINAL', startOfDay),
  ])
}

async function calculateCategoryLeaderboard(
  category: LeaderboardCategory,
  startOfDay: Date
) {
  // Find or create leaderboard for this category
  const leaderboard = await prisma.leaderboard.upsert({
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

  // Get results for this category
  const todayResults = (await prisma.result.findMany({
    where: {
      date: startOfDay,
      categories: {
        some: {
          category,
          completed: true,
          score: { not: null },
        },
      },
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
      guest: true,
      categories: {
        where: {
          category,
          completed: true,
        },
      },
    },
    orderBy: {
      score: 'desc', // Order by the total score for FINAL category
    },
  })) as (Result & { categories: ResultCategory[] })[] // Add type assertion here

  // Create entries for this category
  const entries = todayResults.map((result, index) => ({
    leaderboardId: leaderboard.id,
    resultId: result.id,
    rank: index + 1,
    score: result.categories.find((c) => c.category === category)?.score ?? 0,
  }))

  // Update database
  await prisma.$transaction([
    prisma.leaderboard.update({
      where: { id: leaderboard.id },
      data: { totalParticipants: todayResults.length },
    }),
    prisma.leaderboardEntry.deleteMany({
      where: { leaderboardId: leaderboard.id },
    }),
    prisma.leaderboardEntry.createMany({
      data: entries,
    }),
  ])

  return leaderboard
}
