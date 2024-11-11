/* eslint-disable no-underscore-dangle */
import prisma from '../prisma/prisma'

export async function auditPostY2KDates() {
  console.log('Starting date audit for post-2000 data...')

  const datesWithAllData = await prisma.dates.findMany({
    where: {
      AND: [
        { date: { gte: new Date('1990-01-01') } },
        { interestRates: { some: {} } },
        { currencies: { some: {} } },
        { stockPrices: { some: {} } },
      ],
    },
    select: {
      date: true,
      _count: {
        select: {
          interestRates: true,
          currencies: true,
          stockPrices: true,
        },
      },
    },
    orderBy: {
      date: 'asc',
    },
  })

  console.log(
    `Found ${datesWithAllData.length} dates with all required data after 2000\n`
  )

  datesWithAllData.forEach((date) => {
    console.log(`Date: ${date.date.toISOString().split('T')[0]}`)
    console.log(`  Interest Rates: ${date._count.interestRates}`)
    console.log(`  Currencies: ${date._count.currencies}`)
    console.log(`  Stock Prices: ${date._count.stockPrices}\n`)
  })

  // Also get some statistics about dates with partial data
  const partialDataAudit = await prisma.dates.findMany({
    where: {
      date: { gte: new Date('1990-01-01') },
    },
    select: {
      date: true,
      _count: {
        select: {
          interestRates: true,
          currencies: true,
          stockPrices: true,
        },
      },
    },
  })

  console.log('\nSummary:')
  console.log(
    `Total dates with any data after 2000: ${
      partialDataAudit.filter(
        (d) =>
          d._count.interestRates > 0 ||
          d._count.currencies > 0 ||
          d._count.stockPrices > 0
      ).length
    }`
  )
  console.log(`Dates with complete data after 2000: ${datesWithAllData.length}`)
  console.log(
    `Dates with partial data after 2000: ${
      partialDataAudit.filter(
        (d) =>
          (d._count.interestRates > 0 ||
            d._count.currencies > 0 ||
            d._count.stockPrices > 0) &&
          !(
            d._count.interestRates > 0 &&
            d._count.currencies > 0 &&
            d._count.stockPrices > 0
          )
      ).length
    }`
  )
}
auditPostY2KDates()
