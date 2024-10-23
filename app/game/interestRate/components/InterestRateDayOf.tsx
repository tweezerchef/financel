/* eslint-disable consistent-return */

'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [oldLegendContent, setOldLegendContent] = useState<string>('')
  const [newLegendContent, setNewLegendContent] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const { dailyChallengeInterestRate } = useDailyChallengeContext()
  const { date, category } = dailyChallengeInterestRate || {}
  const legendRef = useRef<HTMLDivElement>(null)
  console.log('date', date, 'category', category)

  useEffect(() => {
    if (dayOfSlide === 'image') {
      const timeoutId = setTimeout(() => {
        setDayOfSlide('day')
      }, 750)
      return () => clearTimeout(timeoutId)
    }
  }, [dayOfSlide])

  useEffect(() => {
    if (amountAway !== null && guessCount !== null) {
      const content = `${
        parseFloat(amountAway) >= 2.51 ? 'Greater Than' : 'Less Than'
      }: ${parseFloat(amountAway) >= 2.51 ? '2.5' : amountAway} Points Away | Guesses Left: ${guessCount}`

      setOldLegendContent(newLegendContent || content)
      setNewLegendContent(content)
      setIsAnimating(true)

      const animationDuration = 1000

      const timeoutId = setTimeout(() => {
        setIsAnimating(false)
        setOldLegendContent(content)
      }, animationDuration)

      return () => clearTimeout(timeoutId)
    }
  }, [amountAway, guessCount, newLegendContent])

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
      <div className={classes.legend} ref={legendRef}>
        <div
          className={`${classes.legendContent} ${isAnimating ? classes.animate : ''}`}
        >
          <span>{oldLegendContent}</span>
          <span>{newLegendContent}</span>
        </div>
      </div>
    </Container>
  )
}
