'use client'

import { useState } from 'react'

import { InterestRateGuess } from './components/InterestRateGuess'
import { InterestRateDayOf } from './components/InterestRateDayOf'
import classes from '../ui/Game.module.css'

type DayOf = 'image' | 'day'

export default function InterestRatePage() {
  const [initialData, setInitialData] = useState<
    Array<{ date: string; interestRate: number }>
  >([])
  const [challengeDate, setChallengeDate] = useState<DayOf>('image')
  const [amountAway, setAmountAway] = useState<string | null>(null)
  const [guessCount, setGuessCount] = useState<number | null>(null)

  return (
    <>
      <div className={classes.dayOf}>
        <InterestRateDayOf
          setChallengeDate={setChallengeDate}
          setInitialData={setInitialData}
          amountAway={amountAway}
          guessCount={guessCount}
        />
      </div>
      <div className={classes.guess}>
        <InterestRateGuess
          initialData={initialData}
          challengeDate={challengeDate}
          setAmountAway={setAmountAway}
          setGuessCount={setGuessCount}
        />
      </div>
    </>
  )
}
