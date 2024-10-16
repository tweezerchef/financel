'use client'

import { useState, useEffect } from 'react'
import { StockDayOf } from './components/StockDayOf'
import { StockGuess } from './components/StockGuess'
import { useDailyChallengeContext } from '../../context/dailyChallenge/DailyChallengeContext'
import classes from './ui/StockPage.module.css'

type DayOf = 'image' | 'day'

export default function Stock() {
  const [challengeDate] = useState<DayOf>('image')
  const [amountAway, setAmountAway] = useState<number | null>(null)
  const [guessCount, setGuessCount] = useState<number | null>(null)
  const { dailyChallengeStock, fetchDailyChallenge } =
    useDailyChallengeContext()

  useEffect(() => {
    if (!dailyChallengeStock) fetchDailyChallenge()
  }, [dailyChallengeStock, fetchDailyChallenge])

  if (!dailyChallengeStock) return <div>Loading...</div>

  return (
    <div className={classes.container}>
      <div className={classes.dayOf}>
        <StockDayOf amountAway={amountAway} guessCount={guessCount} />
      </div>
      <div className={classes.guess}>
        <StockGuess
          challengeDate={challengeDate}
          setAmountAway={setAmountAway}
          setGuessCount={setGuessCount}
        />
      </div>
    </div>
  )
}
