'use client'

import { useState } from 'react'
import { InterestRateGuess } from './interestRate/InterestRateGuess'
import { InterestRateDayOf } from './interestRate/InterestRateDayOf'
import classes from '../ui/Game.module.css'

type DayOf = 'image' | 'day' | 'guess'

export function AuthenticatedGame() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dayOfSlide, setDayOfSlide] = useState<DayOf>('image')
  return (
    <div className={classes.container}>
      <div className={classes.dayOf}>
        <InterestRateDayOf
          dayOfSlide={dayOfSlide}
          setDayOfSlide={setDayOfSlide}
        />
      </div>
      <div className={classes.guess}>
        <InterestRateGuess />
      </div>
    </div>
  )
}
