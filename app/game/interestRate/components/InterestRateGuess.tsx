'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { Keyboard } from '../../components/keyboard/Keyboard'
import { GuessDisplay } from './components/GuessDisplay'
import { NextModal } from '../../components/modal/NextModal'
import { useUserContext } from '../../../context/user/UserContext'
import classes from './ui/InterestRateGuess.module.css'

interface IRmodalProps {
  opened: boolean
  close: () => void
  correct: boolean
  actual: string
  tries?: number
  time?: number
  type: 'Interest Rate' | 'Currency Price' | 'Stock Price'
}

interface Guess {
  id: string
  guess: string
  result: { amount: ResponseNumbers; direction: Direction } | null
  isSpinning: boolean
}

interface InterestRateGuessProps {
  initialData: Array<{ date: string; interestRate: number }>
}

export function InterestRateGuess({ initialData }: InterestRateGuessProps) {
  const [guesses, setGuesses] = useState<Array<Guess>>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [resultId, setResultId] = useState<string | null>(null)
  const [modalProps, setModalProps] = useState<IRmodalProps | null>(null)
  const [opened, handlers] = useDisclosure(false)
  const guessCount = useRef(1)
  const { user } = useUserContext()

  const form = useForm({
    initialValues: {
      guess: '',
    },
    validate: {
      guess: (value) => (value.length === 3 ? null : 'Please enter 3 digits'),
    },
  })

  useEffect(() => {
    if (user?.resultId) setResultId(user.resultId)
    else {
      const storedUserData = localStorage.getItem('userData')
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData)
        setResultId(parsedUserData.resultId)
      }
    }
  }, [user])

  const handleSubmit = useCallback(
    async (values: { guess: string }) => {
      if (isAnimating || guesses.length >= 6 || !resultId) return

      const formattedGuess = `${values.guess[0]}.${values.guess.slice(1)}`
      const currentGuessCount = guessCount.current

      try {
        setIsAnimating(true)
        console.log('Submitting guess with resultId:', resultId)
        const response = await fetch('/game/interestRate/api/guess/', {
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
          result: null,
          isSpinning: true,
        }
        const {
          direction,
          amount,
          isComplete,
          correct,
          timeTaken,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          correctDigits,
          rateNumber,
        } = result
        setGuesses((prevGuesses) => [...prevGuesses, newGuess])
        form.reset()

        setTimeout(() => {
          setGuesses((prevGuesses) =>
            prevGuesses.map((g) =>
              g.id === newGuess.id
                ? {
                    ...g,
                    isSpinning: false,
                    result: {
                      amount,
                      direction,
                    },
                  }
                : g
            )
          )
          setIsAnimating(false)
        }, 1000)
        if (
          (isComplete && !isAnimating) ||
          (guessCount.current === 7 && !isAnimating)
        )
          setTimeout(() => {
            setModalProps({
              opened: true,
              close: () => console.log('Modal closed'),
              correct,
              actual: `${rateNumber}%`,
              tries: currentGuessCount,
              time: timeTaken,
              type: 'Interest Rate',
            })
            handlers.open()
          }, 2500) // 2000 milliseconds = 2 seconds
      } catch (error) {
        console.error('Submission failed:', error)
        setIsAnimating(false)
      }
    },
    [
      isAnimating,
      guesses.length,
      resultId,
      form,
      setGuesses,
      setIsAnimating,
      setModalProps,
      handlers,
    ]
  )
  const memoizedHandleSubmit = useCallback(
    (values: { guess: string }) => {
      handleSubmit(values).catch(console.error)
    },
    [handleSubmit]
  )
  if (!resultId) return <Text>Loading...</Text>

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
        {opened !== undefined && modalProps && (
          <NextModal
            {...modalProps}
            opened={opened}
            initialData={initialData}
          />
        )}
        {guesses.length < 6 ? (
          <form>
            <Keyboard
              form={form}
              field="guess"
              handleSubmit={memoizedHandleSubmit}
            />
          </form>
        ) : (
          <Text>All guesses submitted!</Text>
        )}
      </div>
    </div>
  )
}
