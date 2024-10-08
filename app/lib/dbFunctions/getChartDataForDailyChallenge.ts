/* eslint-disable no-use-before-define */
import prisma from '../prisma/prisma'

interface ChartDataPoint {
  date: string
  interestRate: number
}

export async function getChartDataForDailyChallenge() {
  const challengeDate = await fetch('/game/interestRate/api/dailyChallenge/', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      const { date } = data // Destructure directly from data
      return date // Update this line
    })
  // Find the daily challenge for the given date
  const dailyChallenge = await prisma.dailyChallenge.findUnique({
    where: { challengeDate },
    include: {
      interestRateYearData: true,
      interestRate: {
        include: {
          rateType: true,
        },
      },
    },
  })

  if (!dailyChallenge || !dailyChallenge.interestRateYearData)
    throw new Error('No data found for the given date')

  // Extract and parse the data points
  const dataPoints = dailyChallenge.interestRateYearData.dataPoints as {
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
