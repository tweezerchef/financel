/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { ResultCategory } from '@prisma/client'
import { stockArrowDecider } from './stockArrowDecider'
import { scoreFunction } from '../../../../lib/dbFunctions/scoreFunction'

import prisma from '../../../../lib/prisma/prisma'

export async function POST(request: NextRequest) {
  try {
    const today = new Date()
    const dateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
    const { guess, resultId, guessCount, decimal } = await request.json()

    if (typeof guess !== 'number') throw new Error('Guess must be a number')
    if (!resultId) throw new Error('resultId is required')

    const dailyChallenge = await getDailyChallenge(dateOnly)

    const stockValue = dailyChallenge.stockPrice?.price.toNumber() ?? 0
    console.log('stockValue', stockValue)

    const result = stockArrowDecider(guess, stockValue)
    console.log('percentClose', result.percentClose)
    const { isCorrect } = result
    const isComplete = isCorrect || guessCount === 6

    const now = new Date()

    const [updatedCategory, _] = await Promise.all([
      updateResultCategory(
        resultId,
        guess,
        isCorrect,
        guessCount,
        isComplete,
        result.percentClose,
        now
      ),
      prisma.result.update({
        where: { id: resultId },
        data: { date: dateOnly },
      }),
    ])
    let timeTaken
    if (isComplete) {
      timeTaken = await calculateTimeTaken(isComplete, updatedCategory, now)
      await scoreFunction(resultId)
    }

    return NextResponse.json(
      {
        direction: result.direction,
        amount: result.amount,
        difference: result.difference,
        isComplete,
        correct: isCorrect,
        category: updatedCategory,
        timeTaken: isComplete ? timeTaken : undefined,
        stockValue: isCorrect || isComplete ? stockValue : undefined,
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
      stockPrice: {
        select: {
          price: true,
          stock: {
            select: {
              name: true,
            },
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
  percentClose: number,
  now: Date
) {
  return prisma.resultCategory.upsert({
    where: { resultId_category: { resultId, category: 'STOCK' } },
    create: {
      resultId,
      category: 'STOCK',
      guess,
      correct: isCorrect,
      tries: guessCount,
      completed: isComplete,
      endTime: isComplete ? now : undefined,
      startTime: now,
      percentClose,
    },
    update: {
      guess,
      correct: isCorrect,
      tries: guessCount,
      completed: isComplete,
      endTime: isComplete ? now : undefined,
      percentClose,
    },
  })
}

async function calculateTimeTaken(
  isComplete: boolean,
  category: ResultCategory,
  now: Date
) {
  if (isComplete && category.startTime) {
    const timeTaken = Math.round(
      (now.getTime() - category.startTime.getTime()) / 1000
    )
    await prisma.resultCategory.update({
      where: { id: category.id },
      data: { timeTaken },
    })
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
