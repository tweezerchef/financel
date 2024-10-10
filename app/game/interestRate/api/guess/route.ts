/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { Decimal } from '@prisma/client/runtime/library'
import { ResultCategory } from '@prisma/client'
import { arrowDecider } from '../../../../lib/interestRate/arrowDecider'
import prisma from '../../../../lib/prisma/prisma'

function compareGuessWithRate(guess: number, rate: number): [number, number][] {
  const guessStr = guess.toFixed(2).replace('.', '')
  const rateStr = rate.toFixed(2).replace('.', '')
  const result: [number, number][] = []

  for (let i = 0; i < 3; i++)
    if (guessStr[i] === rateStr[i]) result.push([i, parseInt(guessStr[i], 10)])

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

    if (typeof guess !== 'number') throw new Error('Guess must be a number')
    if (!resultId) throw new Error('resultId is required')

    const dailyChallenge = await getDailyChallenge(dateOnly)
    console.log('Daily Challenge:', dailyChallenge.interestRate.rate)
    const rateNumber = dailyChallenge.interestRate.rate.toNumber()
    console.log('Rate Number:', rateNumber)
    const result = arrowDecider(guess, rateNumber)
    const correctDigits = compareGuessWithRate(guess, rateNumber)
    const isCorrect = correctDigits.length === 3 && guess === rateNumber
    const isComplete = isCorrect || guessCount === 6

    const now = new Date()

    const [updatedCategory, _] = await Promise.all([
      updateResultCategory(
        resultId,
        guess,
        isCorrect,
        guessCount,
        isComplete,
        now
      ),
      prisma.result.update({
        where: { id: resultId },
        data: { date: dateOnly },
      }),
    ])

    const timeTaken = calculateTimeTaken(isComplete, updatedCategory, now)

    return NextResponse.json(
      {
        direction: result.direction,
        amount: result.amount,
        difference: result.difference,
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
    return handleError(error)
  }
}

async function getDailyChallenge(dateOnly: Date) {
  const dailyChallenge = await prisma.dailyChallenge.findUnique({
    where: { challengeDate: dateOnly },
    include: {
      interestRate: {
        select: {
          rate: true,
          date: {
            select: { date: true },
          },
        },
      },
      date: { select: { date: true } },
    },
  })

  if (!dailyChallenge) throw new Error('Invalid daily challenge')

  return dailyChallenge
}

async function updateResultCategory(
  resultId: string,
  guess: number,
  isCorrect: boolean,
  guessCount: number,
  isComplete: boolean,
  now: Date
) {
  return prisma.resultCategory.upsert({
    where: { resultId_category: { resultId, category: 'INTEREST_RATE' } },
    create: {
      resultId,
      category: 'INTEREST_RATE',
      guess,
      correct: isCorrect,
      tries: guessCount,
      completed: isComplete,
      endTime: isComplete ? now : undefined,
      startTime: now,
    },
    update: {
      guess,
      correct: isCorrect,
      tries: guessCount,
      completed: isComplete,
      endTime: isComplete ? now : undefined,
    },
  })
}

function calculateTimeTaken(
  isComplete: boolean,
  category: ResultCategory,
  now: Date
) {
  if (isComplete && category.startTime) {
    const timeTaken = Math.round(
      (now.getTime() - category.startTime.getTime()) / 1000
    )
    prisma.resultCategory
      .update({
        where: { id: category.id },
        data: { timeTaken },
      })
      .catch(console.error) // Fire and forget
    return timeTaken
  }
  return undefined
}

function handleError(error: unknown) {
  if (error instanceof Error)
    return NextResponse.json({ message: error.message }, { status: 400 })

  return NextResponse.json(
    { message: 'An unexpected error occurred' },
    { status: 500 }
  )
}
