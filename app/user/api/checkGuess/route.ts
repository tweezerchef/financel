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

  // Check if the user or guest has guessed all three categories for the day
  const allCategoriesGuessed = await prisma.resultCategory.findMany({
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
  })

  if (allCategoriesGuessed.length >= 3)
    return NextResponse.json(
      { message: 'You have already guessed all categories for today.' },
      { status: 400 }
    )

  // Ensure the user or guest hasn't already made more than 6 guesses for this category today
  const categoryGuessCount = await prisma.resultCategory.count({
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
  })

  if (categoryGuessCount >= 6)
    return NextResponse.json(
      { message: 'Exceeded the maximum number of guesses for this category.' },
      { status: 400 }
    )

  // Check if a result already exists for the guest for today
  const existingResult = await prisma.result.findFirst({
    where: {
      date: startOfToday,
      guestId: guestId || undefined,
    },
  })

  if (existingResult)
    // Update the existing result with the new guess
    await prisma.result.update({
      where: { id: existingResult.id },
      data: {
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
  // Create a new result
  else
    await prisma.result.create({
      data: {
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
