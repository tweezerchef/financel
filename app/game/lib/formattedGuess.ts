export const formattedGuess = (
  unformattedGuess: string,
  digit: number
): number => {
  if (unformattedGuess.length !== 3 || !/^\d{3}$/.test(unformattedGuess))
    throw new Error('Unformatted guess must be a 3-digit string')

  if (digit < 0 || digit > 2) throw new Error('Digit must be between 0 and 2')

  const formattedGuessString = `${unformattedGuess.slice(
    0,
    digit
  )}.${unformattedGuess.slice(digit)}`

  return parseFloat(formattedGuessString)
}
