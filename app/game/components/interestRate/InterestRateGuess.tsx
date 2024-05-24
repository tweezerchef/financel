/* eslint-disable react/no-array-index-key */

'use client'

import { Group, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState, useCallback } from 'react'
import { Keyboard } from '../keyboard/Keyboard'
import { GuessDisplay } from './components/GuessDisplay'
import classes from './ui/InterestRateGuess.module.css'

interface Guess {
  guess: string
  result: { amount: ResponseNumbers; direction: Direction } | null
}

export function InterestRateGuess() {
  const [guesses, setGuesses] = useState<Array<Guess | null>>(
    new Array(6).fill(null)
  )
  const [activeGuessIndex, setActiveGuessIndex] = useState<number>(0)

  const form = useForm({
    initialValues: {
      guess: '0',
    },
    validate: {
      guess: (value) =>
        /^\d{1,3}\.\d{2}$/.test(value)
          ? null
          : 'Invalid guess format (e.g., 1.00)',
    },
  })

  const handleSubmit = async (values: { guess: string }) => {
    console.log('Submitting guess:', values.guess)
    try {
      const response = await fetch('/game/interestRate/api/', {
        method: 'POST',
        body: JSON.stringify({ guess: parseFloat(values.guess) }), // Convert to number on server side
      })
      const result = await response.json()
      console.log(result)

      const newGuesses = [...guesses]
      newGuesses[activeGuessIndex] = {
        guess: values.guess,
        result: {
          amount: result.amount,
          direction: result.direction,
        },
      }
      setGuesses(newGuesses)

      if (activeGuessIndex < 5) setActiveGuessIndex(activeGuessIndex + 1)

      form.reset()
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const createRandomId = useCallback(
    () => Math.random().toString(36).substring(7),
    []
  )

  return (
    <div className={classes.stack}>
      <div className={classes.guessDisplayBox}>
        {guesses.map((result, index) => (
          <div
            key={`guess-${index}`}
            className={classes.guessDisplay}
            style={{
              display: index <= activeGuessIndex ? 'block' : 'none',
            }}
          >
            <GuessDisplay
              guess={result ? result.guess : form.values.guess || '0.00'}
              result={result ? result.result : null}
              createRandomId={createRandomId}
            />
          </div>
        ))}
      </div>
      <div className={classes.guessBox}>
        {activeGuessIndex < 6 && (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group gap="xs">
              <Keyboard
                form={form}
                field="guess"
                handleSubmit={() => handleSubmit(form.values)}
              />
            </Group>
          </form>
        )}
        {activeGuessIndex >= 6 && <Text>All guesses submitted!</Text>}
      </div>
    </div>
  )
}
