'use client'

import { useState } from 'react'

import { InterestRateGuess } from './components/InterestRateGuess'
import { InterestRateDayOf } from './components/InterestRateDayOf'
import classes from '../ui/Game.module.css'

type DayOf = 'image' | 'day' | 'guess'

export default function InterestRatePage() {
  const [initialData, setInitialData] = useState<
    Array<{ date: string; interestRate: number }>
  >([])
  const [dayOfSlide, setDayOfSlide] = useState<DayOf>('image')

  return (
    <>
      <div className={classes.dayOf}>
        <InterestRateDayOf
          dayOfSlide={dayOfSlide}
          setDayOfSlide={setDayOfSlide}
          setInitialData={setInitialData}
        />
      </div>
      <div className={classes.guess}>
        <InterestRateGuess initialData={initialData} />
      </div>
    </>
  )
}
