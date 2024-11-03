/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { updateResultCategory } from '../../../../lib/dbFunctions/updateResultCategory'
import { calculateTimeTaken } from '../../../../lib/dbFunctions/calculateTimeTaken'
import { currencyArrowDecider } from './currencyArrowDecider'
import { scoreFunction } from '../../../../lib/dbFunctions/scoreFunction'

import prisma from '../../../../lib/prisma/prisma'

export async function GET() {
  const irDateInfo = { info: 'Interest Rate Date Info' }
  return NextResponse.json({ irDateInfo }, { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const { guess, resultId, guessCount, dateOnly, today } =
      await request.json()
    const nowDate = new Date(Number(today))

    if (Number.isNaN(nowDate.getTime()))
      throw new Error('Invalid date format for today parameter')

    if (
      typeof guess !== 'number' ||
      !resultId ||
      typeof guessCount !== 'number'
    )
      throw new Error(
        'Invalid input: Guess and guessCount must be numbers, and resultId is required'
      )

    const dailyChallenge = await prisma.dailyChallenge.findUnique({
      where: { challengeDate: dateOnly },
      include: {
        currencyValue: {
          select: {
            value: true,
            date: { select: { date: true } },
          },
        },
        date: { select: { date: true } },
      },
    })

    if (!dailyChallenge) throw new Error('Invalid daily challenge')

    const currencyValue = dailyChallenge.currencyValue?.value.toNumber() ?? 0
    const result = currencyArrowDecider(guess, currencyValue)
    const { isCorrect } = result
    const isComplete = isCorrect || guessCount === 6

    const [updatedCategory] = await Promise.all([
      prisma.resultCategory.upsert({
        where: {
          resultId_category: {
            resultId,
            category: 'CURRENCY',
          },
        },
        create: {
          resultId,
          category: 'CURRENCY',
          guess,
          correct: isCorrect,
          tries: guessCount,
          completed: isComplete,
          startTime: nowDate,
          endTime: isComplete ? nowDate : undefined,
        },
        update: {
          guess,
          correct: isCorrect,
          tries: guessCount,
          completed: isComplete,
          endTime: isComplete ? nowDate : undefined,
        },
      }),
    ])

    let timeTaken
    let score
    let average
    if (isComplete) {
      timeTaken = calculateTimeTaken(isComplete, updatedCategory, nowDate)
      score = scoreFunction({
        correctNumber: currencyValue,
        guessedNumber: guess,
        numGuesses: guessCount,
        timeTaken: timeTaken ?? 0,
      })

      const [, stats] = await prisma.$transaction([
        prisma.resultCategory.update({
          where: {
            resultId_category: {
              resultId,
              category: 'CURRENCY',
            },
          },
          data: {
            score,
            completed: true,
            endTime: nowDate,
          },
        }),
        prisma.categoryStatistics.upsert({
          where: { category: 'CURRENCY' },
          create: {
            category: 'CURRENCY',
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
        direction: result.direction,
        amount: result.amount,
        difference: result.difference,
        isComplete,
        correct: isCorrect,
        category: updatedCategory,
        timeTaken: isComplete ? timeTaken : undefined,
        dollarValue: isCorrect || isComplete ? currencyValue : undefined,
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
