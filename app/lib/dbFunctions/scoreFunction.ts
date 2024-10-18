/* eslint-disable no-plusplus */
import { Result, ResultCategory } from '@prisma/client'
import { prisma } from '../prisma/prisma'

const calculateScore = (
  result: Result & { categories: ResultCategory[] }
): number => {
  // If there are no categories, return a score of 0
  if (result.categories.length === 0) return 0

  // Calculate scores for each category
  const categoryScores = result.categories.map((category) => {
    // If the category is not completed or time taken is missing, score is 0
    if (!category.completed || category.timeTaken === null) return 0

    // Start with a perfect score of 100
    let score = 100

    // List of point deductions based on number of tries (0 to 6 tries)
    const tryDeductions = [0, 5, 10, 15, 20, 25, 30]
    // Deduct points based on the number of tries (max 6 tries)
    score -= tryDeductions[Math.min(category.tries, 6)]

    // Deduct 1 point for every 10 seconds taken
    score -= Math.ceil(category.timeTaken / 10)

    // If the answer is incorrect, adjust the score
    if (!category.correct)
      if (category.percentClose !== null) {
        // If we know how close the answer was, reduce score based on that
        const percentClose = Number(category.percentClose)
        score *= (100 - percentClose) / 100
      }
      // If we don't know how close it was, apply a big penalty (90% reduction)
      else score *= 0.1

    // Make sure the score doesn't go below 0
    return Math.max(0, score)
  })

  // Calculate the average score across all categories
  const totalScore = categoryScores.reduce((sum, score) => sum + score, 0)
  const averageScore = totalScore / categoryScores.length

  // Return the average score without rounding
  return averageScore
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
