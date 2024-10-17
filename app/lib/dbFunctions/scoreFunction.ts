/* eslint-disable no-plusplus */
import { Result, ResultCategory } from '@prisma/client'
import prisma from '../prisma/prisma'

const calculateScore = (
  result: Result & { categories: ResultCategory[] }
): number => {
  if (result.categories.length === 0) return 0 // Return 0 if there are no categories

  const categoryScores = result.categories.map((category) => {
    if (!category.completed || category.timeTaken === null) return 0 // Return 0 for incomplete or invalid categories

    let score = 100

    // Deduct points based on tries (up to 6 tries)
    const tryDeductions = [0, 15, 15, 15, 15, 15, 15]
    for (let i = 1; i <= Math.min(category.tries, 6); i++)
      score -= tryDeductions[i]

    // Deduct points based on time (1 point per 10 seconds)
    score -= Math.ceil(category.timeTaken / 10)

    // Ensure score doesn't go below 0
    return Math.max(0, score)
  })

  // Calculate average score across all categories
  const totalScore = categoryScores.reduce((sum, score) => sum + score, 0)
  const averageScore = totalScore / categoryScores.length

  return averageScore // Remove rounding to keep full precision
}

// Function to update the score in the database
async function updateResultScore(resultId: string): Promise<void> {
  const result = await prisma.result.findUnique({
    where: { id: resultId },
    include: { categories: true },
  })

  if (!result) throw new Error(`Result with id ${resultId} not found`)

  const score = calculateScore(result)

  await prisma.result.update({
    where: { id: resultId },
    data: { score }, // Store the full precision score
  })
}

// Example usage
export async function scoreFunction(resultId: string): Promise<void> {
  try {
    await updateResultScore(resultId)
    console.log(`Score updated for result ${resultId}`)
  } finally {
    await prisma.$disconnect()
  }
}
