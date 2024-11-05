/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import prisma from '../prisma/prisma'
import { calculateDailyLeaderboard } from './calculateDailyLeaderboard'

export async function createDailyFakeScores() {
  try {
    const seedUsers = await prisma.user.findMany({
      where: {
        emailToken: 'SEED_USER',
        isActive: true,
      },
      select: { id: true },
    })
    console.log(`Found ${seedUsers.length} seed users`)

    // Set up today and tomorrow dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const daysToProcess = [today, tomorrow]
    let scoresCreated = false

    for (const date of daysToProcess) {
      const existingScores = await prisma.result.findMany({
        where: {
          date,
          user: {
            emailToken: 'SEED_USER',
          },
        },
      })

      if (existingScores.length !== seedUsers.length)
        for (const user of seedUsers) {
          const existingUserScore = await prisma.result.findUnique({
            where: {
              userId_date: {
                userId: user.id,
                date,
              },
            },
          })

          if (!existingUserScore) {
            const interestRate = faker.number.int({ min: 800, max: 1500 })
            const currency = faker.number.int({ min: 800, max: 1500 })
            const stock = faker.number.int({ min: 800, max: 1500 })

            await prisma.result.create({
              data: {
                userId: user.id,
                date,
                interestRateScore: new Prisma.Decimal(interestRate),
                currencyScore: new Prisma.Decimal(currency),
                stockScore: new Prisma.Decimal(stock),
                score: new Prisma.Decimal(interestRate + currency + stock),
              },
            })

            console.log(
              `Created fake scores for user ${user.id} on ${date.toISOString().split('T')[0]}`
            )
            scoresCreated = true
          } else
            console.log(
              `Score already exists for user ${user.id} on ${date.toISOString().split('T')[0]}, skipping...`
            )
        }
      else
        console.log(
          `Scores already exist for ${date.toISOString().split('T')[0]}, skipping...`
        )
    }

    // Only calculate leaderboards if new scores were created
    if (scoresCreated) {
      await calculateDailyLeaderboard()
      console.log('Leaderboards updated for both days')
    }

    console.log('Daily fake scores created successfully')
  } catch (error) {
    console.error('Error creating daily fake scores:', error)
    throw error
  }
}
createDailyFakeScores()
