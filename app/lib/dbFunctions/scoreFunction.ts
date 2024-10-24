interface ScoreParams {
  correctNumber: number
  guessedNumber: number
  numGuesses: number
  timeTaken: number
  maxGuesses?: number
  maxTime?: number
}

export const scoreFunction = ({
  correctNumber,
  guessedNumber,
  numGuesses,
  timeTaken,
  maxGuesses = 6,
  maxTime = 30000,
}: ScoreParams): number => {
  // Base score
  const baseScore = 1000

  // 1. Number of guesses (if correct)
  let guessScore = 0
  if (guessedNumber === correctNumber)
    guessScore = baseScore * 1.25 * (1 + (maxGuesses - numGuesses) / maxGuesses)

  // 2. Percentage accuracy (if incorrect, else if correct)
  let accuracyScore = 0
  if (guessedNumber !== correctNumber) {
    const accuracy = 1 - Math.abs(correctNumber - guessedNumber) / correctNumber
    accuracyScore = baseScore * 0.5 * accuracy
  } else accuracyScore = baseScore * 0.5 * 1

  // 4. Time taken
  const timeFactor = Math.max(0, (maxTime - timeTaken) / maxTime)
  const timeScore = baseScore * 0.4 * timeFactor

  // 5. Combine scores
  const finalScore =
    guessedNumber === correctNumber
      ? guessScore + timeScore + accuracyScore
      : accuracyScore + timeScore

  return Math.ceil(finalScore)
}
