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
    currencyValue: {
      include: {
        currency: true
      }
    }
    currencyYearData: true
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
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  )
  console.log(`Today's date: ${dateOnly.toISOString().split('T')[0]}`)

  // Get all dates that have interest rate data
  const datesWithBothData = await prisma.dates.findMany({
    where: {
      AND: [{ interestRates: { some: {} } }, { currencies: { some: {} } }],
    },
    select: {
      id: true,
      date: true,
    },
  })

  if (datesWithBothData.length === 0) {
    console.error('No dates with both interest rate and currency data found')
    return
  }

  // Randomly select a date
  const randomDate =
    datesWithBothData[Math.floor(Math.random() * datesWithBothData.length)]

  console.log(`Selected date: ${randomDate.date.toISOString().split('T')[0]}`)

  // Find all available interest rate categories for the selected date
  const availableInterestRates = await prisma.interestRatePrice.findMany({
    where: { dateId: randomDate.id },
    select: { rateType: true },
    distinct: ['interestId'],
  })

  if (availableInterestRates.length === 0) {
    console.error('No interest rates found for the selected date')
    return
  }

  // Randomly select an interest rate category
  const randomInterestRate =
    availableInterestRates[
      Math.floor(Math.random() * availableInterestRates.length)
    ]
  const selectedCategory = randomInterestRate.rateType

  // Find all available currencies for the selected date
  const availableCurrencies = await prisma.currencyValue.findMany({
    where: { dateId: randomDate.id },
    select: { currency: true },
    distinct: ['currencyId'],
  })

  if (availableCurrencies.length === 0) {
    console.error('No currencies found for the selected date')
    return
  }

  // Randomly select a currency
  const randomCurrency =
    availableCurrencies[Math.floor(Math.random() * availableCurrencies.length)]
  const selectedCurrency = randomCurrency.currency

  console.log(`Selected interest rate category: ${selectedCategory.category}`)
  console.log(`Selected currency: ${selectedCurrency.name}`)

  // Fetch the selected date
  const selectedDate = await prisma.dates.findUnique({
    where: { id: randomDate.id },
  })

  if (!selectedDate) {
    console.error('Selected date not found')
    return
  }
  console.log(`Selected date: ${selectedDate.date.toISOString().split('T')[0]}`)

  // Find the interest rate for the selected date and category
  const interestRate = await prisma.interestRatePrice.findFirst({
    where: {
      dateId: selectedDate.id,
      interestId: selectedCategory.id,
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
  const startDate = addDays(selectedDate.date, -182)
  const endDate = addDays(selectedDate.date, 182)
  console.log(
    `Fetching data for date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`
  )

  const yearData = await prisma.interestRatePrice.findMany({
    where: {
      rateType: { id: selectedCategory.id },
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
  const currencyValue = await prisma.currencyValue.findFirst({
    where: {
      dateId: selectedDate.id,
      currencyId: selectedCurrency.id,
    },
  })

  if (!currencyValue) {
    console.error('No currency value found for the selected date and currency')
    return
  }
  console.log(
    `Currency value for selected date and currency: ${currencyValue.value}`
  )

  // Fetch year data for currency (365 days surrounding the chosen date)
  const currencyYearData = await prisma.currencyValue.findMany({
    where: {
      currency: { id: selectedCurrency.id },
      date: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    select: {
      value: true,
      date: { select: { date: true } },
    },
    orderBy: {
      date: { date: 'asc' },
    },
  })

  console.log(
    `Retrieved ${currencyYearData.length} currency data points for the surrounding year`
  )
  const currencyYearDataJson = currencyYearData.map((d) => ({
    date: d.date.date.toISOString().split('T')[0],
    value: d.value.toNumber(),
  }))

  console.log('Sample of currency year data (first 5 entries):')
  console.log(JSON.stringify(currencyYearDataJson.slice(0, 5), null, 2))

  // Create the daily challenge
  const challenge = await prisma.dailyChallenge.create({
    data: {
      challengeDate: dateOnly,
      date: { connect: { id: selectedDate.id } },
      interestRate: { connect: { id: interestRate.id } },
      currencyValue: { connect: { id: currencyValue.id } },
      interestRateYearData: {
        create: {
          startDate,
          endDate,
          dataPoints: yearDataJson,
        },
      },
      currencyYearData: {
        create: {
          startDate,
          endDate,
          dataPoints: currencyYearDataJson,
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
      currencyValue: {
        include: {
          currency: true,
        },
      },
      interestRateYearData: true,
      currencyYearData: true,
    },
  })

  // Type assertion
  const typedChallenge = challenge as ChallengeResult

  console.log('Daily challenge created:')
  console.log(
    JSON.stringify(
      {
        id: typedChallenge.id,
        challengeDate: typedChallenge.challengeDate.toISOString(),
        historicalDate: typedChallenge.date.date.toISOString(),
        interestRateCategory: typedChallenge.interestRate.rateType.category,
        interestRate: typedChallenge.interestRate.rate,
        currency: typedChallenge.currencyValue?.currency.name ?? 'Unknown',
        currencyValue: typedChallenge.currencyValue?.value ?? 0,
        yearDataId: typedChallenge.interestRateYearData?.id,
        yearDataPoints: typedChallenge.interestRateYearData?.dataPoints
          ? Array.isArray(typedChallenge.interestRateYearData.dataPoints)
            ? typedChallenge.interestRateYearData.dataPoints.length
            : undefined
          : undefined,
        currencyYearDataId: typedChallenge.currencyYearData?.id,
        currencyYearDataPoints: typedChallenge.currencyYearData?.dataPoints
          ? Array.isArray(typedChallenge.currencyYearData.dataPoints)
            ? typedChallenge.currencyYearData.dataPoints.length
            : undefined
          : undefined,
      },
      null,
      2
    )
  )

  return typedChallenge
}
