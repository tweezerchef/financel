// app/components/InterestRateChartServer.tsx
import { getChartDataForDailyChallenge } from '../../lib/dbFunctions/getChartDataForDailyChallenge'
import { InterestRateChartClient } from './InterestRateChartClient'

// Define the structure of a single data point
interface ChartDataPoint {
  interestRate: number
  // Add other properties if present in your data points
}

// Define the structure of a dataset
interface ChartDataset {
  label: string
  data: number[]
  fill: boolean
  borderColor: string
  backgroundColor: string
}

export async function InterestRateChartServer() {
  try {
    const chartData = await getChartDataForDailyChallenge()

    if (!chartData || chartData.length === 0) {
      console.error('No chart data available')
      return <div>No data available for the chart</div>
    }

    // Convert ChartDataPoint[] to ChartDataset[]
    const initialData: ChartDataset[] = [
      {
        label: 'Interest Rate',
        data: chartData.map((point: ChartDataPoint) => point.interestRate),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ]
    return <InterestRateChartClient initialData={initialData} />
  } catch (error) {
    console.error('Error fetching chart data:', error)
    return <div>Error fetching chart data</div>
  }
}
