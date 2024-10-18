/* eslint-disable no-use-before-define */

import { prisma } from '../prisma/prisma'

interface ChartDataPoint {
  date: string
  price: number
}

interface GetChartDataProps {
  dailyChallengeId: string
}

export async function getChartDataForStock({
  dailyChallengeId,
}: GetChartDataProps) {
  const dailyChallenge = await prisma.dailyChallenge.findUnique({
    where: {
      id: dailyChallengeId,
    },
    select: {
      stockYearData: {
        select: {
          dataPoints: true,
        },
      },
    },
  })

  if (!dailyChallenge || !dailyChallenge.stockYearData)
    throw new Error('No stock data found for the given daily challenge ID')

  // Extract and parse the data points
  const dataPoints = dailyChallenge.stockYearData.dataPoints as {
    date: string
    price: number
  }[]

  // Format the data for the chart
  const chartData: ChartDataPoint[] = dataPoints.map((point) => ({
    date: formatDate(new Date(`${point.date}Z`)), // Add 'Z' to ensure UTC
    price: point.price,
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
  return `${months[date.getUTCMonth()]} ${date.getUTCDate().toString().padStart(2, '0')}`
}
