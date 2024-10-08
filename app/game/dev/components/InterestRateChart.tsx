import { AreaChart } from '@mantine/charts'
import { Paper } from '@mantine/core'
import { getChartDataForDailyChallenge } from '../../../lib/dbFunctions/getChartDataForDailyChallenge'

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
      <Paper shadow="xs" p="md" style={{ width: '100%', height: '400px' }}>
        <AreaChart
          h={300}
          data={chartData}
          dataKey="date"
          yAxisProps={{ domain: [minRate, maxRate] }}
          series={[{ name: 'interestRate', color: 'blue.6' }]}
          withLegend
          withTooltip
        />
      </Paper>
    )
  } catch (error) {
    console.error('Error rendering InterestRateChart:', error)
    return <div>Error loading chart</div>
  }
}
