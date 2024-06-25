'use client'

import { useLocalStorage } from './lib/useLocalStorage'
import { InterestRateGuess } from './components/interestRate/InterestRateGuess'
import { InterestRateDayOf } from './components/interestRate/InterestRateDayOf'
import classes from './ui/Game.module.css'

export default function Game() {
  const token = useLocalStorage('token')

  if (token === null) return <div>Loading...</div>
  if (!token) return <div>You are not authenticated</div>

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
