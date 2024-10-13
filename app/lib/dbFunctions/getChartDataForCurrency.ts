/* eslint-disable no-use-before-define */
import prisma from '../prisma/prisma'

interface ChartDataPoint {
  date: string
  currency: number
}
interface GetChartDataProps {
  dailyChallengeId: string
}

export async function getChartDataForCurrency({
  dailyChallengeId,
}: GetChartDataProps) {
  // Find the most recent daily challenge
  const dailyChallenge = await prisma.dailyChallenge.findUnique({
    where: { id: dailyChallengeId },
    select: {
      currencyYearData: {
        select: {
          dataPoints: true,
        },
      },
    },
  })
  if (!dailyChallenge || !dailyChallenge.currencyYearData)
    throw new Error('No daily challenge found for the given ID')

  if (!dailyChallenge.currencyYearData.dataPoints)
    throw new Error('No chart data found for the daily challenge')

  const rawDataPoints = dailyChallenge.currencyYearData.dataPoints as {
    date: string
    value: number
  }[]
  const dataPoints: ChartDataPoint[] = rawDataPoints.map((point) => ({
    date: formatDate(new Date(`${point.date}Z`)), // Add 'Z' to ensure UTC
    currency: point.value,
  }))

  return dataPoints
}

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
