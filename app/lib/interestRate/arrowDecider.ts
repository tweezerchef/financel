// MM change
// for some reason the global type definitions are not working here
type ResponseNumbers = 1 | 2 | 3 | 4 | 5

type Direction = '↑' | '↓'

type ArrowDeciderReturn = {
  direction: Direction
  amount: ResponseNumbers
}

function calculateArrowAmount(difference: number): ResponseNumbers {
  // This function determines the number of arrows based on the difference
  // Here, you define what difference corresponds to 1, 2, 3, 4, or 5 arrows
  // Example thresholds could be set as follows (this is adjustable):
  if (difference <= 0.5) return 1
  if (difference <= 1.0) return 2
  if (difference <= 1.5) return 3
  if (difference <= 2.0) return 4
  return 5
}

export function arrowDecider(
  guess: number,
  actual: number
): ArrowDeciderReturn {
  const difference = Math.abs(guess - actual)
  const amount: ResponseNumbers = calculateArrowAmount(difference)

  const direction = guess > actual ? '↓' : '↑'

  return {
    direction,
    amount,
  }
}
