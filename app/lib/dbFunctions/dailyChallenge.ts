import cron from 'node-cron'
import prisma from '../prisma/prisma'

async function createDailyChallenge() {
  const randomDate = await prisma.dates.findFirst({
    orderBy: {
      date: 'asc',
    },
    skip: Math.floor(Math.random() * (await prisma.dates.count())),
  })

  if (!randomDate) {
    console.error('No random date found')
    return
  }

  const randomInterestRate = await prisma.interestRatePrice.findFirst({
    where: { dateId: randomDate.id },
    orderBy: {
      id: 'asc',
    },
    skip: Math.floor(
      Math.random() *
        (await prisma.interestRatePrice.count({
          where: { dateId: randomDate.id },
        }))
    ),
  })

  const randomStockPrice = await prisma.stockPrice.findFirst({
    where: { dateId: randomDate.id },
    orderBy: {
      id: 'asc',
    },
    skip: Math.floor(
      Math.random() *
        (await prisma.stockPrice.count({ where: { dateId: randomDate.id } }))
    ),
  })

  const randomCurrencyValue = await prisma.currencyValue.findFirst({
    where: { dateId: randomDate.id },
    orderBy: {
      id: 'asc',
    },
    skip: Math.floor(
      Math.random() *
        (await prisma.currencyValue.count({
          where: { dateId: randomDate.id },
        }))
    ),
  })

  if (!randomInterestRate || !randomStockPrice || !randomCurrencyValue) {
    console.error('Failed to find necessary data for daily challenge')
    return
  }

  await prisma.dailyChallenge.create({
    data: {
      dateId: randomDate.id,
      interestRateId: randomInterestRate.id,
      stockPriceId: randomStockPrice.id,
      currencyValueId: randomCurrencyValue.id,
    },
  })
}

// Schedule the function to run daily at 12:01 am
cron.schedule('1 0 * * *', async () => {
  console.log('Creating daily challenge')
  await createDailyChallenge()
})
