'use client'

import { InterestRateGuess } from './components/interestRate/InterestRateGuess'
import { InterestRateDayOf } from './components/interestRate/InterestRateDayOf'
import classes from './ui/Game.module.css'

export default function Game() {
  const isAuthenticated = localStorage.getItem('token')
  if (!isAuthenticated) return <div>Loading...</div>

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
