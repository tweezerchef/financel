interface ArrowDeciderReturn {
  amount: number
  difference: number
  direction: 'up' | 'down' | 'same'
}

function calculateArrowAmount(
  difference: number,
  correct: number
): {
  arrows: ResponseNumbers
  difference: number
  correct: number
} {
  // Calculate the percentage difference based on the range
  const percentageDifference = (difference / correct) * 100
  console.log('percentageDifference', percentageDifference)

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

  return { arrows, difference: newDifference, correct }
}

export function currencyArrowDecider(
  guess: number,
  actual: number,
  correct: number
): ArrowDeciderReturn {
  if (guess === actual)
    return {
      difference: 0,
      direction: 'same',
      amount: 0,
    }

  const difference = Math.abs(guess - actual)
  console.log('guess', guess)
  console.log('correct', correct)
  const result = calculateArrowAmount(difference, correct)

  const direction = guess > actual ? 'up' : 'down'
  console.log('new difference', result.difference)
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
