/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useForm } from '@mantine/form'
import { Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { v4 as uuidv4 } from 'uuid'
import { formattedGuess } from '../../lib/formattedGuess'
import { formatDateForChart } from '../../lib/formatDateForChart'
import { useUserContext } from '../../../context/user/UserContext'
import { useDailyChallengeContext } from '../../../context/dailyChallenge/DailyChallengeContext'
import { NextModal } from '../../components/modal/NextModal'
import { Keyboard } from '../../components/keyboard/Keyboard'
import { StockGuessDisplay } from './components/StockGuessDisplay'
import classes from './ui/StockGuess.module.css'

type DayOf = 'image' | 'day'

interface StockGuessProps {
  challengeDate: DayOf
  setAmountAway: React.Dispatch<React.SetStateAction<number | null>>
  setGuessCount: React.Dispatch<React.SetStateAction<number | null>>
}

interface Guess {
  id: string
  guess: string
  result: { amount: ResponseNumbers; direction: Direction } | null
  isSpinning: boolean
}

interface StockModalProps {
  opened: boolean
  close: () => void
  correct: boolean
  actual: string
  tries: number
  time: number
  type: string
  chartData: Array<{ date: string; price: number }>
}

export function StockGuess({
  challengeDate,
  setAmountAway,
  setGuessCount,
}: StockGuessProps) {
  const { user } = useUserContext()
  const { dailyChallengeStock, fetchDailyChallenge } =
    useDailyChallengeContext()
  const [guesses, setGuesses] = useState<Array<Guess>>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [resultId, setResultId] = useState<string | null>(null)
  const [modalProps, setModalProps] = useState<StockModalProps | null>(null)
  const [opened, handlers] = useDisclosure(false)
  const guessCount = useRef(1)
  const [finalGuess, setFinalGuess] = useState<number | null>(null)
  const [formattedChallengeDate, setFormattedChallengeDate] =
    useState<string>('')
  const { chartData, decimal } = dailyChallengeStock ?? {}
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
    if (!dailyChallengeStock) fetchDailyChallenge()
  }, [dailyChallengeStock, fetchDailyChallenge])

  useEffect(() => {
    if (user?.resultId) setResultId(user.resultId)
  }, [user?.resultId])

  useEffect(() => {
    if (dailyChallengeStock?.date) {
      const formattedDate = formatDateForChart(dailyChallengeStock.date)
      setFormattedChallengeDate(formattedDate)
    }
  }, [dailyChallengeStock?.date])
  const handleSubmit = useCallback(
    async (values: { guess: string }) => {
      if (
        isAnimating ||
        guesses.length >= 6 ||
        !resultId ||
        !dailyChallengeStock
      )
        return

      const { decimal } = dailyChallengeStock

      // Pad the guess to 4 digits
      const postGuess = formattedGuess(values.guess, decimal ?? 2)

      // Calculate the numeric guess by inserting the decimal point at the correct position

      const unformattedGuess = values.guess // Default to 2 if decimal is undefined

      try {
        setIsAnimating(true)
        const response = await fetch('/game/stock/api/guess/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            guess: postGuess,
            guessCount: guessCount.current,
            resultId,
            decimal,
          }),
        })
        guessCount.current += 1
        const result = await response.json()

        const newGuess: Guess = {
          id: uuidv4(),
          guess: unformattedGuess, // Use the padded guess string here
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
          stockValue,
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
          setAmountAway(difference)
          setGuessCount(6 - guessCount.current)
        }, 1000)
        if (
          (isComplete && !isAnimating) ||
          (guessCount.current === 7 && !isAnimating)
        ) {
          setFinalGuess(postGuess)
          setTimeout(() => {
            setModalProps({
              opened: true,
              close: () => console.log('Modal closed'),
              correct,
              actual: `$ ${stockValue}`,
              tries: guessCount.current,
              time: timeTaken,
              type: 'Stock Price',
              chartData: chartData || [],
            })
            handlers.open()
          }, 2500)
        }
      } catch (error) {
        console.error('Submission failed:', error)
        setIsAnimating(false)
      }
    },
    [
      isAnimating,
      guesses.length,
      resultId,
      dailyChallengeStock,
      form,
      setAmountAway,
      setGuessCount,
      chartData,
      handlers,
    ]
  )
  const memoizedHandleSubmit = useCallback(
    (values: { guess: string }) => {
      handleSubmit(values).catch(console.error)
    },
    [handleSubmit]
  )

  if (!dailyChallengeStock) return <div>Loading...</div>

  return (
    <div className={classes.stack}>
      <div className={classes.guessDisplayBox}>
        {guesses.map((guess) => (
          <div key={guess.id} className={classes.guessDisplay}>
            <StockGuessDisplay
              guess={guess.guess}
              result={guess.result}
              isSpinning={guess.isSpinning}
              decimal={decimal ?? 2}
            />
          </div>
        ))}
        {!isAnimating && guesses.length < 6 && (
          <div className={classes.guessDisplay}>
            <StockGuessDisplay
              guess={form.values.guess}
              result={null}
              isSpinning={false}
              decimal={decimal ?? 2}
            />
          </div>
        )}
      </div>
      <div className={classes.guessBox}>
        {opened !== undefined && modalProps && finalGuess !== null && (
          <NextModal
            {...modalProps}
            type="Stock Price"
            opened={opened}
            challengeDate={formattedChallengeDate}
            finalGuess={finalGuess}
            chartData={chartData ?? []}
          />
        )}
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
