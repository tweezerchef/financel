interface ArrowDeciderReturn {
  amount: number
  difference: number
  direction: 'up' | 'down' | 'same'
  percentClose: number
  isCorrect: boolean
}

function calculateArrowAmount(
  difference: number,
  correct: number
): {
  arrows: ResponseNumbers
  difference: number
  correct: number
  percentClose: number
} {
  // Calculate the percentage difference based on the range
  const percentageDifference = (difference / correct) * 100

  let arrows: ResponseNumbers
  let newDifference: number
  if (percentageDifference <= 14.99)
    if (percentageDifference < 2.5) {
      arrows = 1
      newDifference = 2.5
    } else if (percentageDifference < 4.99) {
      arrows = 2
      newDifference = 4.99
    } else if (percentageDifference < 10) {
      arrows = 3
      newDifference = 10
    } else if (percentageDifference < 12) {
      arrows = 4
      newDifference = 12
    } else {
      arrows = 5
      newDifference = 14.99
    }
  else if (percentageDifference <= 15) {
    arrows = 1
    newDifference = 15
  } else if (percentageDifference <= 25) {
    arrows = 2
    newDifference = 25
  } else if (percentageDifference <= 35) {
    arrows = 3
    newDifference = 35
  } else if (percentageDifference <= 50) {
    arrows = 4
    newDifference = 50
  } else {
    arrows = 5
    newDifference = 50.01
  }

  return {
    arrows,
    difference: newDifference,
    correct,
    percentClose: percentageDifference,
  }
}

export function currencyArrowDecider(
  guess: number,
  actual: number
): ArrowDeciderReturn {
  console.log('guess', guess)
  console.log('actual', actual)

  // Always consider only the first three digits
  const truncatedActual = Math.trunc(actual * 100) / 100
  console.log('truncatedActual', truncatedActual)

  if (guess === truncatedActual)
    return {
      isCorrect: true,
      difference: 0,
      direction: 'same',
      amount: 0,
      percentClose: 100,
    }

  const difference = Math.abs(guess - truncatedActual)
  const result = calculateArrowAmount(difference, truncatedActual)
  const direction = guess > truncatedActual ? 'up' : 'down'

  return {
    isCorrect: false,
    percentClose: result.percentClose,
    direction,
    amount: result.arrows,
    difference: result.difference,
  }
}
