import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma/prisma'

export async function POST(req: NextRequest) {
  const { userId, guestId, category, guess, guessCount } = await req.json()

  // Validate guess count per category
  if (guessCount > 6)
    return NextResponse.json(
      { message: 'Exceeded the maximum number of guesses for this category.' },
      { status: 400 }
    )

  const today = new Date()
  const startOfToday = new Date(today.setUTCHours(0, 0, 0, 0))

  const [allCategoriesGuessed, categoryGuessCount, existingResult] =
    await prisma.$transaction([
      prisma.resultCategory.findMany({
        where: {
          result: {
            date: startOfToday,
            OR: [
              { userId: userId || undefined },
              { guestId: guestId || undefined },
            ],
          },
        },
        distinct: ['category'],
      }),
      prisma.resultCategory.count({
        where: {
          result: {
            date: startOfToday,
            OR: [
              { userId: userId || undefined },
              { guestId: guestId || undefined },
            ],
          },
          category,
        },
      }),
      prisma.result.findFirst({
        where: {
          date: startOfToday,
          guestId: guestId || undefined,
        },
      }),
    ])

  if (allCategoriesGuessed.length >= 3)
    return NextResponse.json(
      { message: 'You have already guessed all categories for today.' },
      { status: 400 }
    )

  if (categoryGuessCount >= 6)
    return NextResponse.json(
      { message: 'Exceeded the maximum number of guesses for this category.' },
      { status: 400 }
    )

  await prisma.result.upsert({
    where: {
      id: existingResult?.id || 'dummy-id',
    },
    update: {
      categories: {
        create: {
          category,
          guess,
          correct: false, // Adjust based on your logic
          tries: guessCount,
          timeTaken: 0, // Adjust based on your logic
        },
      },
    },
    create: {
      userId,
      guestId,
      date: startOfToday,
      categories: {
        create: {
          category,
          guess,
          correct: false, // Adjust based on your logic
          tries: guessCount,
          timeTaken: 0, // Adjust based on your logic
        },
      },
    },
  })

  return NextResponse.json({ message: 'Guess recorded successfully.' })
}
