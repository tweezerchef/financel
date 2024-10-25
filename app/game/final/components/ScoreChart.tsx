'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { data } from './data'
import { useScoreContext } from '../../../context/user/ScoreContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function ScoreChart() {
  const chartRef = useRef<ChartJS<'bar', number[], string>>(null)
  const { interestScore, currencyScore, stockScore, finalScore } =
    useScoreContext()
  console.log(interestScore, currencyScore, stockScore, finalScore)
  useEffect(() => {
    console.log('Chart data:', data)
  }, [])

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: 'Score',
        data: data.map((item) => item.Smartphones), // Assuming 'Smartphones' is the score field
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
        borderColor: 'rgb(0, 255, 0)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Score Chart',
      },
    },
  }

  return (
    <div style={{ height: '300px', width: '100%', backgroundColor: 'white' }}>
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  )
}
