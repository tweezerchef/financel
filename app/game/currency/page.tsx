/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useState, useEffect } from 'react'
import { CurrencyDayOf } from './components/CurrencyDayOf'
import { CurrencyGuess } from './components/CurrencyGuess'
import { useDailyChallengeContext } from '../../context/dailyChallenge/DailyChallengeContext'
import classes from '../ui/Game.module.css'

type DayOf = 'image' | 'day'

// Add prop types for CurrencyDayOf

export default function Currency() {
  const [amountAway, setAmountAway] = useState<number | null>(null)
  const [guessCount, setGuessCount] = useState<number | null>(null)
  const { dailyChallengeCurrency, fetchDailyChallenge } =
    useDailyChallengeContext()

  useEffect(() => {
    if (!dailyChallengeCurrency) fetchDailyChallenge()
  }, [dailyChallengeCurrency, fetchDailyChallenge])

  if (!dailyChallengeCurrency) return <div>Loading...</div>

  return (
    <div className={classes.container}>
      <div className={classes.dayOf}>
        <CurrencyDayOf amountAway={amountAway} guessCount={guessCount} />
      </div>
      <div className={classes.guess}>
        <CurrencyGuess
          setAmountAway={setAmountAway}
          setGuessCount={setGuessCount}
        />
      </div>
    </div>
  )
}
