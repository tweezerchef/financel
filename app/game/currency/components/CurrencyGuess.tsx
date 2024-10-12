/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { v4 as uuidv4 } from 'uuid'
import { useUserContext } from '../../../context/user/UserContext'
import { NextModal } from '../../components/modal/NextModal'

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
  result: { amount: string; direction: string } | null
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
        /^\d+(\.\d{1,2})?$/.test(value)
          ? null
          : 'Please enter a valid number with up to 2 decimal places',
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

  // const handleSubmit = form.onSubmit(async (values) => {
  //   if (isAnimating || guesses.length >= 6 || !resultId) return

  //   const formattedGuess = parseFloat(values.guess).toFixed(2)
  //   const currentGuessCount = guessCount.current

  //   try {
  //     setIsAnimating(true)
  //     const response = await fetch('/game/currency/api/guess/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         guess: parseFloat(formattedGuess),
  //         guessCount: currentGuessCount,
  //         resultId,
  //       }),
  //     })
  //     guessCount.current += 1
  //     const result = await response.json()

  //     const newGuess: Guess = {
  //       id: uuidv4(),
  //       guess: formattedGuess,
  //       result: null,
  //       isSpinning: true,
  //     }

  //     const {
  //       direction,
  //       amount,
  //       isComplete,
  //       correct,
  //       timeTaken,
  //       difference,
  //       correctDigits,
  //       currencyValue,
  //     } = result

  //     setGuesses((prevGuesses) => [...prevGuesses, newGuess])
  //     form.reset()

  //     setTimeout(() => {
  //       setGuesses((prevGuesses) =>
  //         prevGuesses.map((g) =>
  //           g.id === newGuess.id
  //             ? {
  //                 ...g,
  //                 isSpinning: false,
  //                 result: {
  //                   amount,
  //                   direction,
  //                 },
  //               }
  //             : g
  //         )
  //       )
  //       setIsAnimating(false)
  //       setAmountAway(difference)
  //       setGuessCount(6 - currentGuessCount)
  //     }, 1000)

  //     if (
  //       (isComplete && !isAnimating) ||
  //       (guessCount.current === 7 && !isAnimating)
  //     ) {
  //       setFinalGuess(parseFloat(formattedGuess))
  //       setTimeout(() => {
  //         setModalProps({
  //           opened: true,
  //           close: () => console.log('Modal closed'),
  //           correct,
  //           actual: currencyValue.toString(),
  //           tries: currentGuessCount,
  //           time: timeTaken,
  //           type: 'Currency',
  //         })
  //         handlers.open()
  //       }, 2500)
  //     }
  //   } catch (error) {
  //     console.error('Submission failed:', error)
  //     setIsAnimating(false)
  //   }
  // })

  // Implement the rest of the component logic here, similar to InterestRateGuess
  // This includes rendering the guess input, displaying past guesses, and showing the modal

  return <div>{/* Implement the component's JSX here */}</div>
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
