/* eslint-disable no-underscore-dangle */
import prisma from '../prisma/prisma'

export async function findMostRecentInterestRate() {
  console.log('Finding most recent interest rate date...')

  const mostRecentDate = await prisma.dates.findFirst({
    where: {
      interestRates: {
        some: {}, // ensures there is at least one interest rate
      },
    },
    select: {
      date: true,
      _count: {
        select: {
          interestRates: true,
        },
      },
    },
    orderBy: {
      date: 'desc', // orders by date descending (most recent first)
    },
  })

  if (!mostRecentDate) {
    console.log('No interest rate data found')
    return null
  }

  console.log(
    `Most recent interest rate data found for: ${mostRecentDate.date.toISOString().split('T')[0]}`
  )
  console.log(
    `Number of interest rates for this date: ${mostRecentDate._count.interestRates}`
  )

  return mostRecentDate
}
findMostRecentInterestRate()
