// components/AuthenticatedGame.tsx

'use client'

import { InterestRateGuess } from './interestRate/InterestRateGuess'
import { InterestRateDayOf } from './interestRate/InterestRateDayOf'
import classes from '../ui/Game.module.css'

export function AuthenticatedGame() {
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
