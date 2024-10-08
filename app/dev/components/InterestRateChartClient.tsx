// app/components/InterestRateChartClient.tsx

'use client'

import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ChartDataset {
  label: string
  data: number[]
  fill: boolean
  borderColor: string
  backgroundColor: string
  interestRate?: unknown
  date?: unknown
}

interface InterestRateChartClientProps {
  initialData: ChartDataset[]
}

export function InterestRateChartClient({
  initialData,
}: InterestRateChartClientProps) {
  type ChartDataType = {
    // Define the structure of your chart data here
    // For example:
    labels: string[]
    datasets: ChartDataset[]
  }

  const [chartData, setChartData] = useState<ChartDataType | null>(null)

  useEffect(() => {
    const rates = initialData.map((point) => point.interestRate as number)
    const minRate = Math.floor(Math.min(...rates))
    const maxRate = Math.ceil(Math.max(...rates))

    console.log('Min rate:', minRate, 'Max rate:', maxRate)
    setChartData({
      labels: initialData.map((point) => point.date as string),
      datasets: [
        {
          label: 'Interest Rate',
          data: initialData.map((point) => point.interestRate as number),
          fill: false,
          borderColor: 'rgb(75, 192, 192)' as const,
          backgroundColor: 'rgba(75, 192, 192, 0.2)' as const,
          interestRate: undefined,
          date: undefined,
        },
      ],
    })
  }, [initialData])

  if (!chartData) return <div>Loading...</div>

  const options = {
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}
