/* eslint-disable no-nested-ternary */
// GuessDisplay.tsx

import { Group } from '@mantine/core'
import { SingleDisplay } from './SingleDisplay'
import classes from './ui/GuessDisplay.module.css'

interface GuessDisplayProps {
  guess: string
  result?: { amount: ResponseNumbers; direction: Direction } | null
}

export const GuessDisplay: React.FC<GuessDisplayProps> = ({
  guess,
  result,
}) => {
  const [wholePart, decimalPart] = guess.split('.')
  const isFlipped = !!result

  // Ensure wholePart and decimalPart are always strings
  const wholePartString = wholePart || ''
  const decimalPartString = decimalPart || ''

  return (
    <Group className={classes.container} justify="center" gap="xs">
      <Group className={classes.guessGroup}>
        <SingleDisplay value={wholePartString[0] || ''} isFlipped={isFlipped} />
        <SingleDisplay value={wholePartString[1] || ''} isFlipped={isFlipped} />
        <span className={classes.decimal}>.</span>
        <SingleDisplay
          value={decimalPartString[0] || ''}
          isFlipped={isFlipped}
        />
        <SingleDisplay
          value={decimalPartString[1] || ''}
          isFlipped={isFlipped}
        />
      </Group>
      {result && (
        <Group className={classes.resultGroup}>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <SingleDisplay
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                value={
                  index < result.amount
                    ? result.direction === 'up'
                      ? '↑'
                      : '↓'
                    : ''
                }
                isFlipped={isFlipped}
              />
            ))}
        </Group>
      )}
    </Group>
  )
}
