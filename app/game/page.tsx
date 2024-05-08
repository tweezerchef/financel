'use client'

import { Stack, Container } from '@mantine/core'
import { InterestRateGuess } from './components/interestRate/InterestRateGuess'
import { InterestRateDayOf } from './components/interestRate/InterestRateDayOf'
import classes from './Game.module.css'

export default function Game() {
  return (
    <div className={classes.container}>
      <div className={classes.dayOf}>
        <InterestRateDayOf />
      </div>
      <div className={classes.guess}>
        <InterestRateGuess />
      </div>
    </div>
  )
}
