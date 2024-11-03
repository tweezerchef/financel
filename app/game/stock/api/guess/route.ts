/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { updateResultCategory } from '../../../../lib/dbFunctions/updateResultCategory'
import { calculateTimeTaken } from '../../../../lib/dbFunctions/calculateTimeTaken'
import { stockArrowDecider } from './stockArrowDecider'
import { scoreFunction } from '../../../../lib/dbFunctions/scoreFunction'
import prisma from '../../../../lib/prisma/prisma'
import { calculateDailyLeaderboard } from '../../../../lib/dbFunctions/calculateDailyLeaderboard'

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

    const [dailyChallenge] = await prisma.$transaction([
      prisma.dailyChallenge.findUnique({
        where: { challengeDate: dateOnly },
        include: {
          stockPrice: {
            select: {
              price: true,
              stock: {
                select: { name: true },
              },
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

    const stockValue = dailyChallenge.stockPrice?.price.toNumber() ?? 0
    const isCorrect = guess === stockValue
    const result = stockArrowDecider(guess, stockValue)
    const isComplete = isCorrect || guessCount === 6

    const [updatedCategory] = await Promise.all([
      prisma.resultCategory.upsert({
        where: {
          resultId_category: {
            resultId,
            category: 'STOCK',
          },
        },
        create: {
          resultId,
          category: 'STOCK',
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
      prisma.result.update({
        where: { id: resultId },
        data: { date: dateOnly },
      }),
    ])

    let timeTaken
    let score
    let totalScore
    let average
    if (isComplete) {
      timeTaken = calculateTimeTaken(isComplete, updatedCategory, nowDate)
      score = scoreFunction({
        correctNumber: stockValue,
        guessedNumber: guess,
        numGuesses: guessCount,
        timeTaken: timeTaken ?? 0,
      })

      const [updatedResult, stats] = await prisma.$transaction([
        prisma.resultCategory.update({
          where: {
            resultId_category: {
              resultId,
              category: 'STOCK',
            },
          },
          data: {
            score,
            completed: true,
            endTime: nowDate,
          },
        }),
        prisma.categoryStatistics.upsert({
          where: { category: 'STOCK' },
          create: {
            category: 'STOCK',
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
      // Calculate total score from all categories
      const relatedCategories = await prisma.resultCategory.findMany({
        where: { resultId },
        select: { score: true },
      })

      totalScore = relatedCategories.reduce(
        (acc, category) => acc + (category.score?.toNumber() ?? 0),
        0
      )

      // Second transaction: Update BOTH the FINAL category AND the result table
      await prisma.$transaction([
        prisma.resultCategory.upsert({
          where: {
            resultId_category: {
              resultId,
              category: 'FINAL',
            },
          },
          create: {
            resultId,
            category: 'FINAL',
            guess: 0,
            correct: isCorrect,
            tries: guessCount,
            completed: true,
            score: totalScore,
            startTime: nowDate,
            endTime: nowDate,
          },
          update: {
            score: totalScore,
            completed: true,
            endTime: nowDate,
          },
        }),
        prisma.result.update({
          where: { id: resultId },
          data: {
            stockScore: score,
            score: totalScore,
          },
        }),
      ])
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
  if (error instanceof Error)
    return NextResponse.json({ message: error.message }, { status: 400 })

  return NextResponse.json(
    { message: 'An unexpected error occurred' },
    { status: 500 }
  )
}
