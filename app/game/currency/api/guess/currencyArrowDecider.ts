interface ArrowDeciderReturn {
  amount: number
  difference: number
  direction: 'up' | 'down' | 'same'
}

function calculateArrowAmount(
  difference: number,
  range: number
): {
  arrows: ResponseNumbers
  difference: number
  range: number
} {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const yearRange = range || 1
  let arrows: ResponseNumbers
  let newDifference: number
  if (difference <= 0.25) {
    arrows = 1
    newDifference = 0.25
  } else if (difference <= 0.75) {
    arrows = 2
    newDifference = 0.75
  } else if (difference <= 1.25) {
    arrows = 3
    newDifference = 1.25
  } else if (difference <= 2.5) {
    arrows = 4
    newDifference = 2.5
  } else {
    arrows = 5
    newDifference = 2.51
  }

  return { arrows, difference: newDifference, range }
}

export function arrowDecider(
  guess: number,
  actual: number,
  range: number
): ArrowDeciderReturn {
  if (guess === actual)
    return {
      difference: 0,
      direction: 'same',
      amount: 0,
    }

  const difference = Math.abs(guess - actual)
  const result = calculateArrowAmount(difference, range)

  const direction = guess > actual ? 'up' : 'down'

  // Handle the new return type from calculateArrowAmount
  if (typeof result === 'object')
    return {
      direction,
      amount: result.arrows,
      difference: result.difference,
    }

  return {
    difference: result,
    direction,
    amount: result,
  }
}
