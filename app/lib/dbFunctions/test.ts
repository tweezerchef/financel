export function calculateScore(
  correctNumber: number,
  guessedNumber: number,
  numGuesses: number,
  timeTaken: number,
  maxGuesses: number = 6,
  maxTime: number = 300
): number {
  // Base score
  const baseScore: number = 1000

  // 1. Number of guesses (if correct)
  let guessScore: number = 0
  if (guessedNumber === correctNumber)
    guessScore = baseScore * (1 + (maxGuesses - numGuesses) / maxGuesses)

  // 2. Percentage accuracy (if incorrect)
  let accuracyScore: number = 0
  if (guessedNumber !== correctNumber) {
    const accuracy: number =
      1 - Math.abs(correctNumber - guessedNumber) / correctNumber
    accuracyScore = baseScore * 0.5 * accuracy
  }

  // 3. Number of correct digits
  const correctStr: string = correctNumber.toString().padStart(4, '0')
  const guessedStr: string = guessedNumber.toString().padStart(4, '0')
  const correctDigits: number = Array.from(correctStr).reduce(
    (count, digit, index) => count + (digit === guessedStr[index] ? 1 : 0),
    0
  )
  const digitScore: number = baseScore * 0.25 * (correctDigits / 4)

  // 4. Time taken
  const timeFactor: number = Math.max(0, (maxTime - timeTaken) / maxTime)
  const timeScore: number = baseScore * 0.1 * timeFactor

  // 5. Combine scores
  const finalScore: number =
    guessedNumber === correctNumber
      ? guessScore + digitScore + timeScore
      : accuracyScore + digitScore + timeScore

  return Math.ceil(finalScore)
}
