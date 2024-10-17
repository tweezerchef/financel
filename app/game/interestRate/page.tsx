'use client'

import { useState } from 'react'

import { InterestRateGuess } from './components/InterestRateGuess'
import { InterestRateDayOf } from './components/InterestRateDayOf'
import classes from '../ui/Game.module.css'

export default function InterestRatePage() {
  const [amountAway, setAmountAway] = useState<string | null>(null)
  const [guessCount, setGuessCount] = useState<number | null>(null)

  return (
    <>
      <div className={classes.dayOf}>
        <InterestRateDayOf amountAway={amountAway} guessCount={guessCount} />
      </div>
      <div className={classes.guess}>
        <InterestRateGuess
          setAmountAway={setAmountAway}
          setGuessCount={setGuessCount}
        />
      </div>
    </>
  )
}
