export const formattedGuess = (
  unformattedGuess: string,
  digit: number
): number => {
  if (unformattedGuess.length !== 4 || !/^\d{4}$/.test(unformattedGuess))
    throw new Error('Unformatted guess must be a 4-digit string')

  if (digit < 0 || digit > 3) throw new Error('Digit must be between 0 and 3')

  const formattedGuessString = `${unformattedGuess.slice(
    0,
    digit
  )}.${unformattedGuess.slice(digit)}`

  return parseFloat(formattedGuessString)
}
