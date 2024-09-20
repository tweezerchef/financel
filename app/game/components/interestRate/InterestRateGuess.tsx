/* eslint-disable react/no-array-index-key */

'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Keyboard } from '../keyboard/Keyboard'
import { GuessDisplay } from './components/GuessDisplay'
import classes from './ui/InterestRateGuess.module.css'

interface Guess {
  id: string
  guess: string
  result: { amount: ResponseNumbers; direction: Direction } | null
}

export function InterestRateGuess() {
  const [guesses, setGuesses] = useState<Array<Guess>>([])
  const [activeGuessIndex, setActiveGuessIndex] = useState<number>(0)

  const form = useForm({
    initialValues: {
      guess: '',
    },
    validate: {
      guess: (value) => (value.length === 3 ? null : 'Please enter 3 digits'),
    },
  })

  const handleSubmit = async (values: { guess: string }) => {
    const formattedGuess = `${values.guess[0]}.${values.guess.slice(1)}`

    try {
      const response = await fetch('/game/interestRate/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: parseFloat(formattedGuess) }),
      })
      const result = await response.json()

      const newGuess: Guess = {
        id: uuidv4(),
        guess: formattedGuess,
        result: {
          amount: result.amount,
          direction: result.direction,
        },
      }

      setGuesses((prevGuesses) => [...prevGuesses, newGuess])

      if (activeGuessIndex < 5) setActiveGuessIndex(activeGuessIndex + 1)

      form.reset()
    } catch (error) {
      console.error('Submission failed:', error)
    }
  }

  return (
    <div className={classes.stack}>
      <div className={classes.guessDisplayBox}>
        {guesses.map((guess) => (
          <div key={guess.id} className={classes.guessDisplay}>
            <GuessDisplay guess={guess.guess} result={guess.result} />
          </div>
        ))}
        {activeGuessIndex < 6 && (
          <div className={classes.guessDisplay}>
            <GuessDisplay
              guess={`${form.values.guess[0] || ''}.${form.values.guess.slice(1)}`}
              result={null}
            />
          </div>
        )}
      </div>
      <div className={classes.guessBox}>
        {activeGuessIndex < 6 && (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Keyboard form={form} field="guess" handleSubmit={handleSubmit} />
          </form>
        )}
        {activeGuessIndex >= 6 && <Text>All guesses submitted!</Text>}
      </div>
    </div>
  )
}
