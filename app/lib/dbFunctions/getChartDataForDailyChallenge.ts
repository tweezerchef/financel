/* eslint-disable no-use-before-define */

import prisma from '../prisma/prisma'

// Add this import

interface ChartDataPoint {
  date: string
  interestRate: number
}

export async function getChartDataForDailyChallenge() {
  // Find the most recent daily challenge
  const mostRecentChallenge = await prisma.dailyChallenge.findFirst({
    where: {
      challengeDate: {
        lte: new Date(), // Less than or equal to today
      },
    },
    orderBy: {
      challengeDate: 'desc',
    },
    include: {
      interestRateYearData: true,
      interestRate: {
        include: {
          rateType: true,
        },
      },
    },
  })

  if (!mostRecentChallenge || !mostRecentChallenge.interestRateYearData)
    throw new Error('No recent daily challenge found')

  // Extract and parse the data points
  const dataPoints = mostRecentChallenge.interestRateYearData.dataPoints as {
    date: string
    rate: number
  }[]

  // Format the data for the Mantine AreaChart
  const chartData: ChartDataPoint[] = dataPoints.map((point) => ({
    date: formatDate(new Date(point.date)),
    interestRate: point.rate,
  }))

  return chartData
}

// Helper function to format dates as 'MMM DD' (e.g., 'Mar 22')
function formatDate(date: Date): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`
}
