'use client'

import dynamic from 'next/dynamic'
import 'chart.js/auto'
import { useScoreContext } from '../../../context/user/ScoreContext'

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
})

export function TestScoreChart() {
  const {
    interestScore,
    currencyScore,
    stockScore,
    finalScore,
    averageInterestRate,
    averageCurrency,
    averageStock,
    averageFinal,
  } = useScoreContext()

  const data = {
    labels: ['Interest', 'Currency', 'Stock', 'Final'],
    datasets: [
      {
        label: 'Your Score',
        data: [interestScore, currencyScore, stockScore, finalScore],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Average User Score',
        data: [
          averageInterestRate,
          averageCurrency,
          averageStock,
          averageFinal,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        stacked: false,
      },
    },
  }

  return (
    <div style={{ width: '700px', height: '700px' }}>
      <Bar data={data} options={options} />
    </div>
  )
}
