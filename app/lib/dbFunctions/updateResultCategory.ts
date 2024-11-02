import prisma from '../prisma/prisma'

export async function updateResultCategory(
  resultId: string,
  guess: number,
  isCorrect: boolean,
  guessCount: number,
  isComplete: boolean,
  now: number | Date
) {
  // Ensure we have a Date object
  const nowDate = now instanceof Date ? now : new Date(now)

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
      endTime: isComplete ? nowDate : undefined,
      startTime: nowDate, // Only set startTime during creation
    },
    update: {
      guess,
      correct: isCorrect,
      tries: guessCount,
      completed: isComplete,
      endTime: isComplete ? nowDate : undefined,
      // Removed startTime from update
    },
  })
}
