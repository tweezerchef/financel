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
  // Calculate the percentage difference based on the range
  const percentageDifference = (difference / range) * 100

  let arrows: ResponseNumbers
  let newDifference: number

  if (percentageDifference <= 5) {
    arrows = 1
    newDifference = 0.05 * range
  } else if (percentageDifference <= 15) {
    arrows = 2
    newDifference = 0.15 * range
  } else if (percentageDifference <= 25) {
    arrows = 3
    newDifference = 0.25 * range
  } else if (percentageDifference <= 50) {
    arrows = 4
    newDifference = 0.5 * range
  } else {
    arrows = 5
    newDifference = 0.51 * range
  }

  return { arrows, difference: newDifference, range }
}

export function currencyArrowDecider(
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
  console.log('difference', difference)
  console.log('range', range)
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
