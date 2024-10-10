/* eslint-disable consistent-return */

'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Container, Transition } from '@mantine/core'
import { DayOfImage } from './components/DayOfImage'
import classes from './ui/InterestRateDayOf.module.css'
import { DayOfInfo } from './components/DayOfInfo'

interface InterestRateDayOfProps {
  setChallengeDate: Dispatch<SetStateAction<'image' | 'day'>>

  setInitialData: Dispatch<
    SetStateAction<Array<{ date: string; interestRate: number }>>
  >
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
  setChallengeDate,
  setInitialData,
  amountAway,
  guessCount,
}: InterestRateDayOfProps) {
  const [dayOfInfo, setDayOfInfo] = useState<DayOfInfo | null>(null)
  const [dayOfSlide, setDayOfSlide] = useState<DayOf>('image')

  useEffect(() => {
    if (dayOfSlide === 'image') {
      const timeoutId = setTimeout(() => {
        fetch('/game/interestRate/api/dailyChallenge/', {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((data) => {
            const { date, category, chartData } = data
            console.log('Challenge date:', date)
            setDayOfInfo({ date, category, chartData })
            setInitialData(chartData)
            setChallengeDate(date)
          })
          .then(() => {
            setDayOfSlide('day')
          })
          .catch((error) => {
            console.error('Error fetching daily challenge:', error)
          })
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [dayOfSlide, setChallengeDate, setDayOfSlide, setInitialData])

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
          mounted={dayOfSlide === 'day' && dayOfInfo !== null}
          transition="slide-left"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles} className={classes.slide}>
              {dayOfInfo && (
                <DayOfInfo
                  date={dayOfInfo.date}
                  category={dayOfInfo.category}
                />
              )}
            </div>
          )}
        </Transition>

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
                  {parseFloat(amountAway!) >= 2.51
                    ? 'Greater Than'
                    : 'Less Than'}
                  : {parseFloat(amountAway!) >= 2.51 ? '2.5' : amountAway}{' '}
                  Points Away
                </span>
                <span> Guesses Left: {guessCount}</span>
              </div>
            )}
          </Transition>
        </div>
      </div>
    </Container>
  )
}
