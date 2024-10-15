/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { Keyboard } from '../../components/keyboard/Keyboard'
import { GuessDisplay } from './components/GuessDisplay'
import { NextModal } from '../../components/modal/NextModal'
import { useUserContext } from '../../../context/user/UserContext'
import classes from './ui/InterestRateGuess.module.css'

// Add this helper function at the top of the file, outside the component
function formatDateForChart(date: string): string {
  try {
    const [year, month, day] = date.split('T')[0].split('-')
    const monthNames = [
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
    return `${monthNames[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return date
  }
}

interface IRmodalProps {
  opened: boolean
  close: () => void
  correct: boolean
  actual: string
  tries?: number
  time?: number
  type: 'Interest Rate' | 'Currency Price' | 'Stock Price'
  chartData: Array<{ date: string; interestRate: number }>
}

interface Guess {
  id: string
  guess: string
  result: { amount: ResponseNumbers; direction: Direction } | null
  isSpinning: boolean
}

interface InterestRateGuessProps {
  initialData: Array<{ date: string; interestRate: number }>
  challengeDate: string
  setAmountAway: Dispatch<SetStateAction<string | null>>
  setGuessCount: Dispatch<SetStateAction<number | null>>
}

export function InterestRateGuess({
  initialData,
  challengeDate,
  setAmountAway,
  setGuessCount,
}: InterestRateGuessProps) {
  const [guesses, setGuesses] = useState<Array<Guess>>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [resultId, setResultId] = useState<string | null>(null)
  const [modalProps, setModalProps] = useState<IRmodalProps | null>(null)
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

  useEffect(() => {
    const formattedDate = formatDateForChart(challengeDate)
    setFormattedChallengeDate(formattedDate)
  }, [challengeDate])

  const handleSubmit = useCallback(
    async (values: { guess: string }) => {
      if (isAnimating || guesses.length >= 6 || !resultId) return

      const formattedGuess = `${values.guess[0]}.${values.guess.slice(1)}`
      const currentGuessCount = guessCount.current

      try {
        setIsAnimating(true)
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
          difference,
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
          setAmountAway(difference)
          setGuessCount(6 - currentGuessCount)
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
              tries: currentGuessCount,
              time: timeTaken,
              type: 'Interest Rate',
              chartData: initialData,
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
      form,
      setAmountAway,
      setGuessCount,
      initialData,
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
        {opened !== undefined && modalProps && finalGuess !== null && (
          <NextModal
            {...modalProps}
            opened={opened}
            chartData={initialData}
            challengeDate={formattedChallengeDate}
            finalGuess={finalGuess}
          />
        )}
        {guesses.length < 6 ? (
          <form>
            <Keyboard
              form={form}
              field="guess"
              handleSubmit={memoizedHandleSubmit}
              maxDigits={3}
            />
          </form>
        ) : (
          <Text>All guesses submitted!</Text>
        )}
      </div>
    </div>
  )
}
