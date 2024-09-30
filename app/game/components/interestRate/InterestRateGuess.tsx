'use client'

import { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Keyboard } from '../keyboard/Keyboard'
import { GuessDisplay } from './components/GuessDisplay'
import { useUserContext } from '../../../context/user/UserContext'
import classes from './ui/InterestRateGuess.module.css'

interface Guess {
  id: string
  guess: string
  result: { amount: ResponseNumbers; direction: Direction } | null
  isSpinning: boolean
}

interface UserDataType {
  resultId: string
}

export function InterestRateGuess() {
  const [guesses, setGuesses] = useState<Array<Guess>>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const guessCount = useRef(1)
  const { user } = useUserContext()
  const { resultId } = user as UserDataType
  const form = useForm({
    initialValues: {
      guess: '',
    },
    validate: {
      guess: (value) => (value.length === 3 ? null : 'Please enter 3 digits'),
    },
  })

  const handleSubmit = async (values: { guess: string }) => {
    if (isAnimating || guesses.length >= 6) return

    const formattedGuess = `${values.guess[0]}.${values.guess.slice(1)}`
    const currentGuessCount = guessCount.current

    try {
      setIsAnimating(true)
      const response = await fetch('/game/components/interestRate/api/guess/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guess: parseFloat(formattedGuess),
          guessCount: currentGuessCount,
          resultId,
        }),
      })
      guessCount.current += 1
      const result = await response.json()

      const newGuess: Guess = {
        id: uuidv4(),
        guess: formattedGuess,
        result: {
          amount: result.amount,
          direction: result.direction,
        },
        isSpinning: true,
      }

      setGuesses((prevGuesses) => [...prevGuesses, newGuess])
      form.reset()

      setTimeout(() => {
        setGuesses((prevGuesses) =>
          prevGuesses.map((g) =>
            g.id === newGuess.id ? { ...g, isSpinning: false } : g
          )
        )
        setIsAnimating(false)
      }, 1500)
    } catch (error) {
      console.error('Submission failed:', error)
      setIsAnimating(false)
    } finally {
      setIsAnimating(false)
    }
  }

  return (
    <div className={classes.stack}>
      <div className={classes.guessDisplayBox}>
        {guesses.map((guess) => (
          <div key={guess.id} className={classes.guessDisplay}>
            <GuessDisplay
              guess={guess.guess}
              result={guess.result}
              isSpinning={guess.isSpinning}
            />
          </div>
        ))}
        {!isAnimating && guesses.length < 6 && (
          <div className={classes.guessDisplay}>
            <GuessDisplay
              guess={`${form.values.guess[0] || ''}.${form.values.guess.slice(1)}`}
              result={null}
              isSpinning={false}
            />
          </div>
        )}
      </div>
      <div className={classes.guessBox}>
        {guesses.length < 6 ? (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Keyboard form={form} field="guess" handleSubmit={handleSubmit} />
          </form>
        ) : (
          <Text>All guesses submitted!</Text>
        )}
      </div>
    </div>
  )
}
