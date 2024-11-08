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
  ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useScoreContext } from '../../../context/user/ScoreContext'
import { useUserContext } from '../../../context/user/UserContext'
import classes from './ui/ScoreChart.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function ScoreChart() {
  const chartRef = useRef<ChartJS<'bar'>>(null)
  const [sharing, setSharing] = useState(false)
  const {
    interestScore,
    currencyScore,
    stockScore,
    finalScore,
    averageInterestRate,
    averageCurrency,
    averageStock,
    averageFinal,
    refreshScore,
  } = useScoreContext()
  const { user } = useUserContext()
  const resultId = user?.resultId

  if (!stockScore || !currencyScore || !interestScore || !finalScore)
    refreshScore(resultId || '')

  const chartData = {
    labels: ['Interest', 'Currency', 'Stock', 'Final'],
    datasets: [
      {
        label: 'Your Score',
        data: [interestScore, currencyScore, stockScore, finalScore],
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
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
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Category',
        },
        display: true,
      },
      y: {
        title: {
          display: true,
          text: 'Score',
        },
        beginAtZero: true,
        display: true,
      },
    },
  }

  const handleShareToTwitter = async () => {
    if (chartRef.current)
      try {
        setSharing(true)
        const chartCanvas = chartRef.current.canvas
        if (!chartCanvas) {
          alert('Chart is not available for sharing.')
          return
        }

        // Convert canvas to Blob
        chartCanvas.toBlob(async (blob) => {
          if (!blob) {
            alert('Failed to generate chart image.')
            return
          }

          // Create FormData and append the blob
          const formData = new FormData()
          formData.append('chart', blob, 'chart.png')

          // Upload the image to the server
          const uploadResponse = await fetch('/api/uploadChart', {
            method: 'POST',
            body: formData,
          })

          if (!uploadResponse.ok) throw new Error('Chart upload failed')

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { imageUrl, chartId } = await uploadResponse.json()

          if (!chartId) throw new Error('chartId is undefined in the response')

          // Construct the URL to the chart page
          const chartPageUrl = `${window.location.origin}/chartShare/${chartId}`

          // Construct the Twitter share URL
          const tweetText = 'Check out my Financle score chart!'
          const twitterShareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(chartPageUrl)}&text=${encodeURIComponent(tweetText)}`

          // Redirect to the Twitter share URL
          window.location.href = twitterShareUrl
        }, 'image/png')
      } catch (err) {
        console.error('Failed to share chart:', err)
        alert('Failed to share chart. Please try again.')
      } finally {
        setSharing(false)
      }
    else alert('Chart is not available for sharing.')
  }

  return (
    <div
      style={{
        width: '80%',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <Bar ref={chartRef} data={chartData} options={options} />
      <button
        onClick={handleShareToTwitter}
        disabled={sharing}
        className={classes.shareButton}
      >
        {sharing ? 'Preparing...' : 'Share to X'}
      </button>
    </div>
  )
}
