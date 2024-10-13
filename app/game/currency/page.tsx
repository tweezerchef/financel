/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button, Text } from '@mantine/core'
import { CurrencyDayOf } from './components/CurrencyDayOf'
import { CurrencyGuess } from './components/CurrencyGuess'
import classes from './ui/CurrencyPage.module.css'

type DayOf = 'image' | 'day'

// Add prop types for CurrencyDayOf
interface CurrencyDayOfProps {
  setChallengeDate: React.Dispatch<React.SetStateAction<DayOf>>
  setInitialData: React.Dispatch<
    React.SetStateAction<Array<{ date: string; currency: number }>>
  >
  amountAway: string | null
  guessCount: number | null
}

// Add prop types for CurrencyGuess
interface CurrencyGuessProps {
  initialData: Array<{ date: string; currency: number }>
  challengeDate: DayOf
  setAmountAway: React.Dispatch<React.SetStateAction<string | null>>
  setGuessCount: React.Dispatch<React.SetStateAction<number | null>>
}

// Add prop types for CurrencyDayOf
interface CurrencyDayOfProps {
  setChallengeDate: React.Dispatch<React.SetStateAction<DayOf>>
  setInitialData: React.Dispatch<
    React.SetStateAction<Array<{ date: string; currency: number }>>
  >
  amountAway: string | null
  guessCount: number | null
}

// Add prop types for CurrencyGuess
interface CurrencyGuessProps {
  initialData: Array<{ date: string; currency: number }>
  challengeDate: DayOf
  setAmountAway: React.Dispatch<React.SetStateAction<string | null>>
  setGuessCount: React.Dispatch<React.SetStateAction<number | null>>
}

export default function Currency() {
  const [initialData, setInitialData] = useState<
    Array<{ date: string; currency: number }>
  >([])
  const [challengeDate, setChallengeDate] = useState<DayOf>('image')
  const [amountAway, setAmountAway] = useState<string | null>(null)
  const [guessCount, setGuessCount] = useState<number | null>(null)
  return (
    <div className={classes.container}>
      <div className={classes.dayOf}>
        <CurrencyDayOf amountAway={amountAway} guessCount={guessCount} />
      </div>
      <div className={classes.guess}>
        <CurrencyGuess
          initialData={initialData}
          challengeDate={challengeDate}
          setAmountAway={setAmountAway}
          setGuessCount={setGuessCount}
        />
      </div>
    </div>
  )
}
