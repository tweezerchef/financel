/* eslint-disable consistent-return */

'use client'

import { useEffect, useState } from 'react'
import { Container, Transition } from '@mantine/core'
import { DayOfImage } from './components/DayOfImage'
import classes from './ui/InterestRateDayOf.module.css'
import { DayOfInfo } from './components/DayOfInfo'
import { useDailyChallengeContext } from '../../../context/dailyChallenge/DailyChallengeContext'

interface InterestRateDayOfProps {
  amountAway: string | null
  guessCount: number | null
}

type DayOf = 'image' | 'day'

interface DayOfInfo {
  date: string
  category: string
  chartData: Array<{ date: string; interestRate: number }>
}

export function InterestRateDayOf({
  amountAway,
  guessCount,
}: InterestRateDayOfProps) {
  const [dayOfSlide, setDayOfSlide] = useState<DayOf>('image')
  const [isLoading, setIsLoading] = useState(true)
  const { dailyChallengeInterestRate } = useDailyChallengeContext()
  const { date, category } = dailyChallengeInterestRate || {}
  console.log('date', date, 'category', category)

  useEffect(() => {
    if (dailyChallengeInterestRate) setIsLoading(false)
  }, [dailyChallengeInterestRate])

  useEffect(() => {
    if (dayOfSlide === 'image') {
      const timeoutId = setTimeout(() => {
        setDayOfSlide('day')
      }, 750)
      return () => clearTimeout(timeoutId)
    }
  }, [dayOfSlide])

  if (isLoading) return <div>Loading...</div> // Or any loading component

  return (
    <Container className={classes.dayOfContainer}>
      <div className={classes.slideWrapper}>
        <Transition
          mounted={dayOfSlide === 'image'}
          transition="slide-left"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles} className={classes.slide}>
              <DayOfImage />
            </div>
          )}
        </Transition>

        <Transition
          mounted={
            dayOfSlide === 'day' && date !== undefined && category !== undefined
          }
          transition="slide-left"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles} className={classes.slide}>
              {date && category && (
                <DayOfInfo date={date} category={category} />
              )}
            </div>
          )}
        </Transition>
      </div>
      <div className={classes.legend}>
        <Transition
          mounted={!!amountAway && !!guessCount}
          transition="slide-up"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles} className={classes.legendContent}>
              <span>
                {parseFloat(amountAway!) >= 2.51 ? 'Greater Than' : 'Less Than'}
                : {parseFloat(amountAway!) >= 2.51 ? '2.5' : amountAway} Points
                Away
              </span>
              <span> Guesses Left: {guessCount}</span>
            </div>
          )}
        </Transition>
      </div>
    </Container>
  )
}
