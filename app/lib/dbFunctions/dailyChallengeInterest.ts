/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import { Prisma } from '@prisma/client'
import prisma from '../prisma/prisma'

type ChallengeResult = Prisma.DailyChallengeGetPayload<{
  include: {
    date: true
    interestRate: {
      include: {
        rateType: true
      }
    }
    interestRateYearData: true
  }
}>

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export async function createDailyChallenge() {
  console.log('Starting createDailyChallenge function')

  const today = new Date()
  const dateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  console.log(`Today's date: ${dateOnly.toISOString().split('T')[0]}`)

  // Get the total count of dates
  const totalDates = await prisma.dates.count()
  console.log(`Total dates in database: ${totalDates}`)

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * totalDates)
  console.log(`Random index selected: ${randomIndex}`)

  // Fetch the random date
  const randomDate = await prisma.dates.findFirst({
    skip: randomIndex,
  })

  if (!randomDate) {
    console.error('No random date found')
    return
  }
  console.log(
    `Random date selected: ${randomDate.date.toISOString().split('T')[0]}`
  )

  // Find a random interest rate category for the selected date
  const interestRateCategories = await prisma.interestRate.findMany()
  console.log(
    `Available interest rate categories: ${interestRateCategories.map((c) => c.category).join(', ')}`
  )

  const randomCategory =
    interestRateCategories[
      Math.floor(Math.random() * interestRateCategories.length)
    ]
  console.log(
    `Randomly selected interest rate category: ${randomCategory.category}`
  )

  // Find the interest rate for the selected date and category
  const interestRate = await prisma.interestRatePrice.findFirst({
    where: {
      dateId: randomDate.id,
      interestId: randomCategory.id,
    },
  })

  if (!interestRate) {
    console.error('No interest rate found for the selected date and category')
    return
  }
  console.log(
    `Interest rate for selected date and category: ${interestRate.rate}`
  )

  // Fetch year data (365 days surrounding the chosen date)
  const startDate = addDays(randomDate.date, -182)
  const endDate = addDays(randomDate.date, 182)
  console.log(
    `Fetching data for date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`
  )

  const yearData = await prisma.interestRatePrice.findMany({
    where: {
      rateType: { id: randomCategory.id },
      date: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    select: {
      rate: true,
      date: { select: { date: true } },
    },
    orderBy: {
      date: { date: 'asc' },
    },
  })

  console.log(
    `Retrieved ${yearData.length} data points for the surrounding year`
  )
  const yearDataJson = yearData.map((d) => ({
    date: d.date.date.toISOString().split('T')[0],
    rate: d.rate.toNumber(),
  }))

  console.log('Sample of year data (first 5 entries):')
  console.log(JSON.stringify(yearDataJson.slice(0, 5), null, 2))

  // Create the daily challenge
  const challenge = await prisma.dailyChallenge.create({
    data: {
      challengeDate: dateOnly,
      date: { connect: { id: randomDate.id } },
      interestRate: { connect: { id: interestRate.id } },
      interestRateYearData: {
        create: {
          startDate,
          endDate,
          dataPoints: yearDataJson,
        },
      },
    },
    include: {
      date: true,
      interestRate: {
        include: {
          rateType: true,
        },
      },
      interestRateYearData: true,
    },
  })

  // Type assertion
  const typedChallenge = challenge as ChallengeResult

  console.log('Daily challenge created:')
  console.log(
    JSON.stringify(
      {
        id: typedChallenge.id,
        challengeDate: typedChallenge.challengeDate.toISOString().split('T')[0],
        historicalDate: typedChallenge.date.date.toISOString().split('T')[0],
        interestRateCategory: typedChallenge.interestRate.rateType.category,
        interestRate: typedChallenge.interestRate.rate,
        yearDataId: typedChallenge.interestRateYearData?.id,
        yearDataPoints: typedChallenge.interestRateYearData?.dataPoints
          ? Array.isArray(typedChallenge.interestRateYearData.dataPoints)
            ? typedChallenge.interestRateYearData.dataPoints.length
            : undefined
          : undefined,
      },
      null,
      2
    )
  )

  return typedChallenge
}
