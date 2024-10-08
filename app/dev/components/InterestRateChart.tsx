import { LineChart } from '@mantine/charts'

import { getChartDataForDailyChallenge } from '../../lib/dbFunctions/getChartDataForDailyChallenge'

export async function InterestRateChart() {
  try {
    const chartData = await getChartDataForDailyChallenge()
    console.log('Chart data:', chartData)

    if (!chartData || chartData.length === 0) {
      console.error('No chart data available')
      return <div>No data available for the chart</div>
    }

    const rates = chartData.map((point) => point.interestRate)
    const minRate = Math.floor(Math.min(...rates))
    const maxRate = Math.ceil(Math.max(...rates))

    console.log('Min rate:', minRate, 'Max rate:', maxRate)

    return (
      <LineChart
        h={300}
        data={chartData}
        dataKey="date"
        series={[{ name: 'interestRate', color: 'blue.6' }]}
        curveType="linear"
      />
    )
  } catch (error) {
    console.error('Error fetching chart data:', error)
    return <div>Error fetching chart data</div>
  }
}
