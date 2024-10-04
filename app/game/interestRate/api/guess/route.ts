import { NextRequest, NextResponse } from 'next/server'
import { Decimal } from '@prisma/client/runtime/library'
import { arrowDecider } from '../../../../lib/interestRate/arrowDecider'
import prisma from '../../../../lib/prisma/prisma'

type DailyChallenge = {
  challengeDate: Date
  interestRate: {
    rate: Decimal
  }
} | null

// In-memory cache with proper typing
let dailyChallengeCache: {
  data: DailyChallenge
  expiresAt: number
} | null = null

const getSecondsUntilMidnight = () => {
  const now = new Date()
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  )
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}
function compareGuessWithRate(guess: number, rate: number): [number, number][] {
  const guessStr = guess.toFixed(2)
  const rateStr = rate.toFixed(2)
  const result: [number, number][] = []

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < guessStr.length; i++)
    if (guessStr[i] !== '.')
      if (guessStr[i] === rateStr[i])
        result.push([i < 3 ? i + 1 : i, parseInt(guessStr[i], 10)])

  return result
}

export async function GET() {
  const irDateInfo = { info: 'Interest Rate Date Info' }
  return NextResponse.json({ irDateInfo }, { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const today = new Date()
    const dateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
    const { guess, resultId, guessCount } = await request.json()
    console.log('Received guess:', guess)

    if (typeof guess !== 'number') throw new Error('Guess must be a number')
    if (!resultId) throw new Error('resultId is required')

    let dailyChallenge = dailyChallengeCache?.data
    if (!dailyChallenge) {
      dailyChallenge = await prisma.dailyChallenge.findUnique({
        where: { challengeDate: dateOnly },
        include: { interestRate: { select: { rate: true } } },
      })
      if (!dailyChallenge) throw new Error('Invalid daily challenge')
      dailyChallengeCache = {
        data: dailyChallenge,
        expiresAt: Date.now() + getSecondsUntilMidnight() * 1000,
      }
    }

    const rateNumber = dailyChallenge.interestRate.rate.toNumber()
    const result = arrowDecider(guess, rateNumber)
    console.log('Result:', result, 'Actual rate:', rateNumber)
    const correctDigits = compareGuessWithRate(guess, rateNumber)
    const isCorrect = result.amount === 0
    const isComplete = isCorrect || guessCount === 6

    const now = new Date()

    let updatedCategory = await prisma.resultCategory.upsert({
      where: {
        resultId_category: {
          resultId,
          category: 'INTEREST_RATE',
        },
      },
      create: {
        resultId,
        category: 'INTEREST_RATE',
        guess,
        correct: isCorrect,
        tries: guessCount,
        completed: isComplete,
        endTime: isComplete ? now : undefined,
        startTime: now, // Set startTime for new entries
      },
      update: {
        guess,
        correct: isCorrect,
        tries: guessCount,
        completed: isComplete,
        endTime: isComplete ? now : undefined,
      },
    })

    let timeTaken: number | undefined

    // If the guess is complete, calculate and update timeTaken
    if (isComplete && updatedCategory.startTime) {
      timeTaken = Math.round(
        (now.getTime() - updatedCategory.startTime.getTime()) / 1000
      )
      updatedCategory = await prisma.resultCategory.update({
        where: { id: updatedCategory.id },
        data: { timeTaken },
      })
    }

    await prisma.result.update({
      where: { id: resultId },
      data: { date: dateOnly },
    })

    return NextResponse.json(
      {
        direction: result.direction,
        amount: result.amount,
        isComplete,
        correct: isCorrect,
        category: updatedCategory,
        timeTaken: isComplete ? timeTaken : undefined,
        correctDigits,
        rateNumber: isCorrect || isComplete ? rateNumber : undefined,
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error in POST request:', error)
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 })
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
