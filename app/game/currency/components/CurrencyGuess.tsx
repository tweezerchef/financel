/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useForm } from '@mantine/form'
import { Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { v4 as uuidv4 } from 'uuid'
import { useUserContext } from '../../../context/user/UserContext'
import { useDailyChallengeContext } from '../../../context/dailyChallenge/DailyChallengeContext'
import { NextModal } from '../../components/modal/NextModal'
import { Keyboard } from '../../components/keyboard/Keyboard'
import { CurrencyGuessDisplay } from './components/CurrencyGuessDisplay'
import classes from './ui/CurrencyGuess.module.css'

type DayOf = 'image' | 'day'

interface CurrencyGuessProps {
  initialData: Array<{ date: string; currency: number }>
  challengeDate: DayOf
  setAmountAway: React.Dispatch<React.SetStateAction<string | null>>
  setGuessCount: React.Dispatch<React.SetStateAction<number | null>>
}

interface Guess {
  id: string
  guess: string
  result: { amount: ResponseNumbers; direction: Direction } | null
  isSpinning: boolean
}

interface CurrencyModalProps {
  opened: boolean
  close: () => void
  correct: boolean
  actual: string
  tries: number
  time: number
  type: string
}

export function CurrencyGuess({
  initialData,
  challengeDate,
  setAmountAway,
  setGuessCount,
}: CurrencyGuessProps) {
  const { dailyChallengeCurrency } = useDailyChallengeContext()
  const decimalPlace = dailyChallengeCurrency?.decimalPlace ?? 2 // Default to 2 if null
  const [guesses, setGuesses] = useState<Array<Guess>>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [resultId, setResultId] = useState<string | null>(null)
  const [modalProps, setModalProps] = useState<CurrencyModalProps | null>(null)
  const [opened, handlers] = useDisclosure(false)
  const guessCount = useRef(1)
  const { user } = useUserContext()
  const [finalGuess, setFinalGuess] = useState<number | null>(null)
  const [formattedChallengeDate, setFormattedChallengeDate] =
    useState<string>('')

  const form = useForm({
    initialValues: {
      guess: '',
    },
    validate: {
      guess: (value) =>
        /^\d{1,4}(\.\d{1,2})?$/.test(value)
          ? null
          : 'Please enter a valid number with up to 4 digits and up to 2 decimal places',
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

  useEffect(() => {
    const formattedDate = formatDateForChart(challengeDate)
    setFormattedChallengeDate(formattedDate)
  }, [challengeDate])

  const handleSubmit = useCallback(
    async (values: { guess: string }) => {
      if (isAnimating || guesses.length >= 6 || !resultId) return

      // Format the guess based on decimalPlace
      const formattedGuess = values.guess.padStart(4, '0').slice(0, 4)
      const numericGuess = parseFloat(formattedGuess) / 10 ** (decimalPlace - 1)

      try {
        setIsAnimating(true)
        const response = await fetch('/game/currency/api/guess/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guess: numericGuess,
            guessCount: guessCount.current,
            resultId,
            decimalPlace,
          }),
        })
        guessCount.current += 1
        const result = await response.json()

        const newGuess: Guess = {
          id: uuidv4(),
          guess: formattedGuess, // Use the padded guess string here
          result: null,
          isSpinning: true,
        }
        const {
          direction,
          amount,
          isComplete,
          correct,
          timeTaken,
          difference,
          correctDigits,
          rateNumber,
        } = result
        console.log(correctDigits)
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
          setAmountAway(difference)
          setGuessCount(6 - guessCount.current)
        }, 1000)
        if (
          (isComplete && !isAnimating) ||
          (guessCount.current === 7 && !isAnimating)
        ) {
          setFinalGuess(parseFloat(formattedGuess))
          setTimeout(() => {
            setModalProps({
              opened: true,
              close: () => console.log('Modal closed'),
              correct,
              actual: `${rateNumber}%`,
              tries: guessCount.current,
              time: timeTaken,
              type: 'Interest Rate',
            })
            handlers.open()
          }, 2500) // 2000 milliseconds = 2 seconds
        } // Add this closing brace
      } catch (error) {
        console.error('Submission failed:', error)
        setIsAnimating(false)
      }
    },
    [
      isAnimating,
      guesses.length,
      resultId,
      decimalPlace,
      form,
      setAmountAway,
      setGuessCount,
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

  // Implement the rest of the component logic here, similar to InterestRateGuess
  // This includes rendering the guess input, displaying past guesses, and showing the modal

  return (
    <div className={classes.stack}>
      <div className={classes.guessDisplayBox}>
        {guesses.map((guess) => (
          <div key={guess.id} className={classes.guessDisplay}>
            <CurrencyGuessDisplay
              guess={guess.guess}
              result={guess.result}
              isSpinning={guess.isSpinning}
              decimalPlace={decimalPlace}
            />
          </div>
        ))}
        {!isAnimating && guesses.length < 6 && (
          <div className={classes.guessDisplay}>
            <CurrencyGuessDisplay
              guess={form.values.guess}
              result={null}
              isSpinning={false}
              decimalPlace={decimalPlace}
            />
          </div>
        )}
      </div>
      <div className={classes.guessBox}>
        {/* {opened !== undefined && modalProps && finalGuess !== null && (
          <NextModal
            {...modalProps}
            opened={opened}
            initialData={initialData}
            challengeDate={formattedChallengeDate}
            finalGuess={finalGuess}
          />
        )} */}
        {guesses.length < 6 ? (
          <form>
            <Keyboard
              form={form}
              field="guess"
              handleSubmit={memoizedHandleSubmit}
              maxDigits={4}
            />
          </form>
        ) : (
          <Text>All guesses submitted!</Text>
        )}
      </div>
    </div>
  )
}

function formatDateForChart(date: string | Date): string {
  const d = new Date(date)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[d.getMonth()]} ${d.getDate().toString().padStart(2, '0')}`
}
