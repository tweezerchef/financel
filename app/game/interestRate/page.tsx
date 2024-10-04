'use client'

import { useState } from 'react'

import { InterestRateGuess } from './components/InterestRateGuess'
import { InterestRateDayOf } from './components/InterestRateDayOf'
import classes from '../ui/Game.module.css'

type DayOf = 'image' | 'day' | 'guess'

export default function InterestRatePage() {
  const [dayOfSlide, setDayOfSlide] = useState<DayOf>('image')

  return (
    <>
      <div className={classes.dayOf}>
        <InterestRateDayOf
          dayOfSlide={dayOfSlide}
          setDayOfSlide={setDayOfSlide}
        />
      </div>
      <div className={classes.guess}>
        <InterestRateGuess />
      </div>
    </>
  )
}
