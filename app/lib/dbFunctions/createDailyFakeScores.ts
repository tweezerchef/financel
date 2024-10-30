/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import prisma from '../prisma/prisma'
import { calculateDailyLeaderboard } from './calculateDailyLeaderboard'

async function createDailyFakeScores() {
  try {
    // Get only seeded users
    const seedUsers = await prisma.user.findMany({
      where: {
        emailToken: 'SEED_USER',
        isActive: true,
      },
      select: { id: true },
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Create results for each seeded user
    for (const user of seedUsers) {
      // Generate scores first
      const interestRate = faker.number.int({ min: 800, max: 1500 })
      const currency = faker.number.int({ min: 800, max: 1500 })
      const stock = faker.number.int({ min: 800, max: 1500 })

      // Create or update result for today
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await prisma.result.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
        create: {
          userId: user.id,
          date: today,
          interestRateScore: new Prisma.Decimal(interestRate),
          currencyScore: new Prisma.Decimal(currency),
          stockScore: new Prisma.Decimal(stock),
          score: new Prisma.Decimal(interestRate + currency + stock),
        },
        update: {}, // If result exists, do nothing
      })

      console.log(`Created fake scores for seeded user ${user.id}`)
    }

    // Add this line to update the leaderboard after creating fake scores
    await calculateDailyLeaderboard()

    console.log('Daily fake scores created successfully')
  } catch (error) {
    console.error('Error creating daily fake scores:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}
createDailyFakeScores()

export { createDailyFakeScores }
