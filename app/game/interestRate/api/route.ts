import { NextRequest, NextResponse } from 'next/server'
import { Decimal } from '@prisma/client/runtime/library'
import { arrowDecider } from '../../../lib/interestRate/arrowDecider'
import prisma from '../../../lib/prisma/prisma'

// Define types for the daily challenge data
type InterestRate = {
  rate: Decimal
}

type DailyChallenge = {
  challengeDate: Date
  interestRate: InterestRate
}

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

    let dailyChallenge
    const now = Date.now()

    if (dailyChallengeCache && dailyChallengeCache.expiresAt > now)
      dailyChallenge = dailyChallengeCache.data
    else {
      dailyChallenge = await prisma.dailyChallenge.findUnique({
        where: { challengeDate: dateOnly },
        include: {
          interestRate: {
            select: {
              rate: true,
            },
          },
        },
      })

      if (!dailyChallenge) throw new Error('Invalid daily challenge')

      const secondsUntilMidnight = getSecondsUntilMidnight()
      dailyChallengeCache = {
        data: dailyChallenge,
        expiresAt: now + secondsUntilMidnight * 1000,
      }
    }

    const { rate } = dailyChallenge.interestRate
    const rateNumber = rate.toNumber()
    const result = arrowDecider(guess, rateNumber)
    console.log('Result:', result, 'Actual rate:', rateNumber)

    await prisma.$transaction(async (tx) => {
      const existingCategory = await tx.resultCategory.findFirst({
        where: {
          resultId,
          category: 'INTEREST_RATE',
        },
      })

      if (existingCategory)
        await tx.resultCategory.update({
          where: { id: existingCategory.id },
          data: {
            guess,
            correct: result.amount === 0,
            tries: guessCount,
          },
        })
      else
        await tx.resultCategory.create({
          data: {
            resultId,
            category: 'INTEREST_RATE',
            guess,
            correct: result.amount === 0,
            tries: guessCount,
          },
        })

      await tx.result.update({
        where: { id: resultId },
        data: { date: dateOnly },
      })
    })

    return NextResponse.json(
      { direction: result.direction, amount: result.amount },
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
