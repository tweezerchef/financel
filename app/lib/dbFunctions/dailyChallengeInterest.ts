/* eslint-disable consistent-return */
import prisma from '../prisma/prisma'

export async function createDailyChallenge() {
  // Get the total count of dates
  const totalDates = await prisma.dates.count()

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * totalDates)

  // Fetch the random date
  const randomDate = await prisma.dates.findFirst({
    skip: randomIndex,
  })

  if (!randomDate) {
    console.error('No random date found')
    return
  }

  // Find a random interest rate for the selected date
  const interestRatesForDate = await prisma.interestRatePrice.findMany({
    where: { dateId: randomDate.id },
  })

  if (interestRatesForDate.length === 0) {
    console.error('No interest rates found for the selected date')
    return
  }

  const randomInterestRate =
    interestRatesForDate[
      Math.floor(Math.random() * interestRatesForDate.length)
    ]

  // Create the daily challenge
  const challenge = await prisma.dailyChallenge.create({
    data: {
      dateId: randomDate.id,
      interestRateId: randomInterestRate.id,
    },
    include: {
      date: true,
      interestRate: true,
    },
  })

  console.log(`Daily challenge created for date: ${randomDate.date}`)
  return challenge
}
