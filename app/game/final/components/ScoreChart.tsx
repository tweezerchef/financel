'use client'

import { useRef } from 'react'
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
import { useUserContext } from '../../../context/user/UserContext'
// import classes from './ui/ScoreChart.module.css'

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
    refreshScore,
  } = useScoreContext()
  const { user } = useUserContext()
  const resultId = user?.resultId
  if (!stockScore || !currencyScore || !interestScore || !finalScore)
    refreshScore(resultId || '')

  // const [copyStatus, setCopyStatus] = useState<string>('')
  // const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  // const [tweetUrl, setTweetUrl] = useState<string>('')

  const chartData = {
    labels: ['Interest', 'Currency', 'Stock', 'Final'],
    datasets: [
      {
        label: 'Your Score',
        data: [interestScore, currencyScore, stockScore, finalScore],
        backgroundColor: 'rgba(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
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
        backgroundColor: 'rgba(54, 162, 235)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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

  // const copyChartToClipboard = async () => {
  //   if (chartRef.current)
  //     try {
  //       const chartImage = chartRef.current.toBase64Image()

  //       // Check if the device supports the Clipboard API
  //       if (navigator.clipboard && navigator.clipboard.write) {
  //         const blob = await fetch(chartImage).then((res) => res.blob())
  //         await navigator.clipboard.write([
  //           new ClipboardItem({
  //             [blob.type]: blob,
  //           }),
  //         ])
  //       } else {
  //         // Fallback for devices that don't support Clipboard API
  //         const tempImg = document.createElement('img')
  //         tempImg.src = chartImage
  //         tempImg.style.position = 'fixed'
  //         tempImg.style.left = '-9999px'
  //         document.body.appendChild(tempImg)

  //         const range = document.createRange()
  //         range.selectNode(tempImg)
  //         window.getSelection()?.removeAllRanges()
  //         window.getSelection()?.addRange(range)

  //         try {
  //           const successful = document.execCommand('copy')
  //           if (!successful) throw new Error('Copy command failed')
  //         } finally {
  //           window.getSelection()?.removeAllRanges()
  //           document.body.removeChild(tempImg)
  //         }
  //       }

  //       setCopyStatus('Chart copied to clipboard!')
  //       setTimeout(() => setCopyStatus(''), 3000) // Clear status after 3 seconds
  //     } catch (err) {
  //       console.error('Failed to copy chart:', err)
  //       setCopyStatus('Failed to copy chart. Please try again.')
  //     }
  // }

  // const prepareChartForDownload = () => {
  //   if (chartRef.current)
  //     try {
  //       const chartImage = chartRef.current.toBase64Image()
  //       setDownloadUrl(chartImage)
  //       setCopyStatus('Chart ready for download!')
  //       setTimeout(() => setCopyStatus(''), 3000)
  //     } catch (err) {
  //       console.error('Failed to prepare chart for download:', err)
  //       setCopyStatus('Failed to prepare chart. Please try again.')
  //     }
  // }

  // const prepareChartForTweet = async () => {
  //   if (chartRef.current)
  //     try {
  //       const chartImage = chartRef.current.toBase64Image()

  //       // Convert base64 to blob
  //       const response = await fetch(chartImage)
  //       const blob = await response.blob()

  //       // Create form data
  //       const formData = new FormData()
  //       formData.append('chart', blob, 'chart.png')

  //       // Send to your server
  //       const uploadResponse = await fetch('/api/uploadChart', {
  //         method: 'POST',
  //         body: formData,
  //       })

  //       if (!uploadResponse.ok) throw new Error('Chart upload failed')

  //       const { imageUrl } = await uploadResponse.json()

  //       // Extract the chart ID from the imageUrl
  //       const chartId = imageUrl.split('/').pop()

  //       const tweetText = encodeURIComponent(
  //         'Check out my Financle score chart!'
  //       )

  //       // Use the correct production URL for Twitter sharing
  //       const twitterShareDomain = 'https://financle.vercel.app'
  //       const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(`${twitterShareDomain}/chart/${chartId}`)}`

  //       setTweetUrl(tweetUrl)
  //       setCopyStatus('Chart ready for tweeting!')
  //       setTimeout(() => setCopyStatus(''), 3000)
  //     } catch (err) {
  //       console.error('Failed to prepare chart for tweet:', err)
  //       setCopyStatus('Failed to prepare chart for tweet. Please try again.')
  //     }
  // }

  // useEffect(() => {
  //   // Load Twitter widgets.js
  //   const script = document.createElement('script')
  //   script.src = 'https://platform.twitter.com/widgets.js'
  //   script.async = true
  //   document.body.appendChild(script)

  //   return () => {
  //     document.body.removeChild(script)
  //   }
  // }, [])

  return (
    <>
      <div style={{ width: '100%', height: '180px' }}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>
      {/* <div>
        <Button onClick={copyChartToClipboard}>Copy Chart to Clipboard</Button>
        {downloadUrl ? (
          <a href={downloadUrl} download="score-chart.png">
            <Button>Download Chart</Button>
          </a>
        ) : (
          <Button onClick={prepareChartForDownload}>
            Prepare Chart for Download
          </Button>
        )}
      </div> */}
    </>
  )
}
