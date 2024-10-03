/* eslint-disable consistent-return */

'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Container, Transition } from '@mantine/core'
import { DayOfImage } from './components/DayOfImage'
import classes from './ui/InterestRateDayOf.module.css'
import { DayOfInfo } from './components/DayOfInfo'

interface InterestRateDayOfProps {
  dayOfSlide: 'image' | 'day' | 'guess'
  // eslint-disable-next-line react/no-unused-prop-types
  setDayOfSlide: Dispatch<SetStateAction<'image' | 'day' | 'guess'>>
}
interface DayOfInfo {
  date: string
  category: string
}

export function InterestRateDayOf({
  dayOfSlide,
  setDayOfSlide,
}: InterestRateDayOfProps) {
  const [dayOfInfo, setDayOfInfo] = useState<DayOfInfo | null>(null)
  useEffect(() => {
    if (dayOfSlide === 'image') {
      const timeoutId = setTimeout(() => {
        fetch('/game/interestRate/api/dailyChallenge/', {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((data) => {
            const { date, category } = data // Destructure directly from data
            console.log(date, category)
            setDayOfInfo({ date, category }) // Update this line
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
  }, [dayOfSlide, setDayOfSlide]) // Add setDayOfSlide to dependency array
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
      </div>
    </Container>
  )
}
