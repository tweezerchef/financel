/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

/* eslint-disable no-nested-ternary */
import { Modal, Button, Text, Title, Center } from '@mantine/core'
import { useReward } from 'react-rewards'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { InterestRateChart } from './charts/interestRate/InterestRateChart'
import { CurrencyChart } from './charts/currency/CurrencyChart'
import { StockChart } from './charts/stock/StockChart'
import { useDailyChallengeContext } from '../../../context/dailyChallenge/DailyChallengeContext'

import classes from './ui/NextModal.module.css'

function formatDateForChart(date: string): string {
  try {
    const [year, month, day] = date.split('T')[0].split('-')
    const monthNames = [
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
    return `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return date
  }
}

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

type ChartDataPoint =
  | { date: string; interestRate: number }
  | { date: string; currency: number }
  | { date: string; value: number }

interface NextModalProps {
  opened: boolean
  close: () => void
  correct: boolean
  actual: string
  tries?: number
  time?: number
  challengeDate: string
  finalGuess: number | undefined
  type: 'Interest Rate' | 'Currency Price' | 'Stock Price'
  chartData?: ChartDataPoint[]
}

// Add this type definition
type CurrencyTypeWithChart = {
  chartData?: Array<{ date: string; currency: number }>
}

export function NextModal({
  opened,
  close,
  correct,
  actual,
  tries,
  time,
  challengeDate,
  finalGuess,
  type,
  chartData,
}: NextModalProps) {
  const rewardRef = useRef<HTMLDivElement>(null)
  const { reward, isAnimating } = useReward('wrongAnswerReward', 'emoji', {
    emoji: ['💩'],
    elementCount: 20,
    elementSize: 30,
    spread: 40,
  })
  const { dailyChallengeCurrency } = useDailyChallengeContext()
  const formattedDate = dailyChallengeCurrency
    ? formatDateForChart(dailyChallengeCurrency.date)
    : ''

  const yearData = (dailyChallengeCurrency as CurrencyTypeWithChart)?.chartData

  const animationCountRef = useRef(0)

  useEffect(() => {
    if (opened && !correct && !isAnimating && animationCountRef.current < 2) {
      const timer = setTimeout(() => {
        reward()
        animationCountRef.current += 1
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [opened, correct, reward, isAnimating])

  const title = correct ? 'Correct!' : `Wrong!`

  let timeString: string
  if (time && time < 60)
    timeString = `${time} ${time === 1 ? 'second' : 'seconds'}`
  else if (time) {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    timeString = `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
  } else timeString = '0 seconds'

  const subTitle = correct
    ? `You took ${tries} ${tries === 1 ? 'try' : 'tries'} and ${timeString} to get today's ${type}`
    : `Sorry, try again tomorrow! The actual ${type} was ${actual}`

  const next =
    type === 'Interest Rate'
      ? 'currency'
      : type === 'Currency Price'
        ? 'stock'
        : type === 'Stock Price'
          ? 'final'
          : ''

  const renderChart = () => {
    if (!chartData && !yearData) return null

    switch (type) {
      case 'Interest Rate':
        return (
          <InterestRateChart
            date={challengeDate}
            guess={finalGuess}
            chartData={
              chartData as Array<{ date: string; interestRate: number }>
            }
          />
        )
      case 'Currency Price':
        return (
          <CurrencyChart
            date={formattedDate}
            guess={finalGuess}
            chartData={
              yearData ||
              (chartData as Array<{ date: string; currency: number }>)
            }
          />
        )
      // case 'Stock Price':
      //   return (
      //     <StockChart
      //       date={challengeDate}
      //       guess={finalGuess}
      //       yearData={chartData}
      //     />
      //   )
      default:
        return null
    }
  }

  return (
    <div className={classes.nextModal}>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        classNames={{ root: classes.modalRoot, content: classes.modalContent }}
      >
        <div className={classes.modalInner}>
          <div
            ref={rewardRef}
            id="wrongAnswerReward"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {correct && <Confetti recycle numberOfPieces={200} />}

          <Center>
            <Title order={3} className={classes.modalTitle}>
              {title}
            </Title>
          </Center>
          <Center>
            <Text className={classes.modalText}>{subTitle}</Text>
          </Center>

          {renderChart()}

          <Center>
            <Link href={`/game/${next}`} passHref legacyBehavior>
              <Button component="a" className={classes.nextButton}>
                Next
              </Button>
            </Link>
          </Center>
        </div>
      </Modal>
    </div>
  )
}
