'use client'

import { useRef, useState } from 'react'
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
import { useScoreContext } from '../../../context/user/ScoreContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function ScoreChart() {
  const chartRef = useRef<ChartJS<'bar', number[], string>>(null)
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
  const [copyStatus, setCopyStatus] = useState<string>('')
  console.log(averageInterestRate)

  const chartData = {
    labels: ['Interest', 'Currency', 'Stock', 'Final'],
    datasets: [
      {
        label: 'User Score',
        data: [interestScore, currencyScore, stockScore, finalScore],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Average Score',
        data: [
          averageInterestRate,
          averageCurrency,
          averageStock,
          averageFinal,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
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

  const copyChartToClipboard = async () => {
    if (chartRef.current)
      try {
        const chartImage = chartRef.current.toBase64Image()
        const blob = await fetch(chartImage).then((res) => res.blob())
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ])
        setCopyStatus('Chart copied to clipboard!')
        setTimeout(() => setCopyStatus(''), 3000) // Clear status after 3 seconds
      } catch (err) {
        console.error('Failed to copy chart:', err)
        setCopyStatus('Failed to copy chart. Please try again.')
      }
  }

  return (
    <div>
      <div style={{ height: '300px', width: '100%', backgroundColor: 'white' }}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
      <button onClick={copyChartToClipboard}>Copy Chart to Clipboard</button>
      {copyStatus && <p>{copyStatus}</p>}
    </div>
  )
}
