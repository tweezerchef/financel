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
    include: { currencyYearData: true },
  })
  if (!dailyChallenge || !dailyChallenge.currencyYearDataId)
    throw new Error('No daily challenge found for the given ID')

  if (!dailyChallenge.currencyYearData?.dataPoints)
    throw new Error('No chart data found for the daily challenge')

  const rawDataPoints = dailyChallenge.currencyYearData.dataPoints as {
    date: string
    rate: number
  }[]
  const dataPoints: ChartDataPoint[] = rawDataPoints.map((point) => ({
    date: formatDate(new Date(point.date)),
    currency: point.rate,
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
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`
}