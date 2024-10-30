/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { ResultCategory } from '@prisma/client'
import { stockArrowDecider } from './stockArrowDecider'
import { scoreFunction } from '../../../../lib/dbFunctions/scoreFunction'

import prisma from '../../../../lib/prisma/prisma'
import { calculateDailyLeaderboard } from '../../../../lib/dbFunctions/calculateDailyLeaderboard'

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

    const [dailyChallenge, resultUpdate] = await prisma.$transaction([
      prisma.dailyChallenge.findUnique({
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
      }),
      prisma.result.update({
        where: { id: resultId },
        data: { date: dateOnly },
      }),
    ])

    if (!dailyChallenge) throw new Error('Invalid daily challenge')

    const stockValue = dailyChallenge.stockPrice?.price.toNumber() ?? 0

    const result = stockArrowDecider(guess, stockValue)

    const { isCorrect } = result
    const isComplete = isCorrect || guessCount === 6

    const [updatedCategory, _] = await Promise.all([
      updateResultCategory(
        resultId,
        guess,
        isCorrect,
        guessCount,
        isComplete,
        today
      ),
      resultUpdate,
    ])
    let timeTaken
    let score
    let totalScore
    if (isComplete) {
      timeTaken = await calculateTimeTaken(isComplete, updatedCategory, today)
      score = scoreFunction({
        correctNumber: stockValue,
        guessedNumber: guess,
        numGuesses: guessCount,
        timeTaken: timeTaken ?? 0,
      })
      await prisma.resultCategory.update({
        where: { id: updatedCategory.id },
        data: { score, completed: true },
      })
      await prisma.categoryStatistics.upsert({
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
      })
      const relatedCategories = await prisma.resultCategory.findMany({
        where: { resultId },
        select: { score: true },
      })

      totalScore = relatedCategories.reduce(
        (acc, category) => acc + (category.score?.toNumber() ?? 0),
        0
      )

      // Create FINAL category entry
      await prisma.resultCategory.upsert({
        where: { resultId_category: { resultId, category: 'FINAL' } },
        create: {
          resultId,
          category: 'FINAL',
          guess: 0,
          correct: isCorrect,
          tries: guessCount,
          completed: isComplete,
          score: totalScore,
          startTime: today,
          endTime: today,
        },
        update: {
          score: totalScore,
          completed: true,
          endTime: today,
        },
      })

      // Update the score in the Result table
      await prisma.result.update({
        where: { id: resultId },
        data: { score: totalScore },
      })

      await calculateDailyLeaderboard()
    }
    await prisma.categoryStatistics.upsert({
      where: { category: 'FINAL' },
      create: {
        category: 'FINAL',
        totalScore: totalScore ?? 0,
        count: 1,
      },
      update: {
        totalScore: { increment: totalScore ?? 0 },
        count: { increment: 1 },
      },
    })

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
        totalScore: isComplete ? totalScore : undefined,
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
