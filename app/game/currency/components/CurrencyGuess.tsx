/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

type DayOf = 'image' | 'day'

interface CurrencyGuessProps {
  initialData: Array<{ date: string; currency: number }>
  challengeDate: DayOf
  setAmountAway: React.Dispatch<React.SetStateAction<string | null>>
  setGuessCount: React.Dispatch<React.SetStateAction<number | null>>
}

export const CurrencyGuess: React.FC<CurrencyGuessProps> = ({
  initialData,
  challengeDate,
  setAmountAway,
  setGuessCount,
}) => {
  // Component implementation
  return (
    <div>
      {/* Your CurrencyGuess component logic here */}
      CurrencyGuess
    </div>
  )
}
