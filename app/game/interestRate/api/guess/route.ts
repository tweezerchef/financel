/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { ResultCategory } from '@prisma/client'
import { arrowDecider } from './arrowDecider'
import { scoreFunction } from '../../../../lib/dbFunctions/scoreFunction'

import prisma from '../../../../lib/prisma/prisma'

export async function GET() {
  const irDateInfo = { info: 'Interest Rate Date Info' }
  return NextResponse.json({ irDateInfo }, { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const today = new Date()
    const dateOnly = new Date(today.setHours(0, 0, 0, 0))

    const { guess, resultId, guessCount } = await request.json()
    if (
      typeof guess !== 'number' ||
      !resultId ||
      typeof guessCount !== 'number'
    )
      throw new Error(
        'Invalid input: Guess and guessCount must be numbers, and resultId is required'
      )

    const [dailyChallenge, result] = await prisma.$transaction([
      prisma.dailyChallenge.findUnique({
        where: { challengeDate: dateOnly },
        include: {
          interestRate: {
            select: {
              rate: true,
              date: { select: { date: true } },
            },
          },
          date: { select: { date: true } },
        },
      }),
      prisma.result.update({
        where: { id: resultId },
        data: { date: dateOnly },
      }),
    ])

    if (!dailyChallenge) throw new Error('Invalid daily challenge')

    const rateNumber = dailyChallenge.interestRate.rate.toNumber()

    const isCorrect = guess === rateNumber
    const resultDirection = arrowDecider(guess, rateNumber)
    const isComplete = isCorrect || guessCount === 6

    const now = new Date()

    const [updatedCategory] = await Promise.all([
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

    let timeTaken
    let score
    let average
    if (isComplete) {
      timeTaken = calculateTimeTaken(isComplete, updatedCategory, now)
      score = scoreFunction({
        correctNumber: rateNumber,
        guessedNumber: guess,
        numGuesses: guessCount,
        timeTaken: timeTaken ?? 0,
      })

      const [updatedResult, stats] = await prisma.$transaction([
        prisma.resultCategory.update({
          where: {
            resultId_category: {
              resultId,
              category: 'INTEREST_RATE',
            },
          },
          data: { score, completed: true },
        }),
        prisma.categoryStatistics.upsert({
          where: { category: 'INTEREST_RATE' },
          create: {
            category: 'INTEREST_RATE',
            totalScore: score,
            count: 1,
          },
          update: {
            totalScore: { increment: score },
            count: { increment: 1 },
          },
        }),
      ])

      average = stats.totalScore.toNumber() / stats.count
    }

    return NextResponse.json(
      {
        direction: resultDirection.direction,
        amount: resultDirection.amount,
        difference: resultDirection.difference,
        isComplete,
        correct: isCorrect,
        category: updatedCategory,
        timeTaken: isComplete ? timeTaken : undefined,
        rateNumber: isCorrect || isComplete ? rateNumber : undefined,
        score: isComplete ? score : undefined,
        average: isComplete ? average : undefined,
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
  console.error('API Error:', error)

  if (error instanceof Error) {
    if (error.message.includes('Invalid input'))
      return NextResponse.json({ message: error.message }, { status: 400 })

    if (error.message.includes('Invalid daily challenge'))
      return NextResponse.json(
        { message: 'No challenge available for today' },
        { status: 404 }
      )
  }

  return NextResponse.json(
    { message: 'An unexpected error occurred' },
    { status: 500 }
  )
}
