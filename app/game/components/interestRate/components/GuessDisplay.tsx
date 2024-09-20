/* eslint-disable no-nested-ternary */
// GuessDisplay.tsx

// GuessDisplay.tsx

import React from 'react'
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

  return (
    <Group className={classes.container} justify="center" gap="xs">
      <Group className={classes.guessGroup}>
        <SingleDisplay value={wholePart || ''} />
        <span className={classes.decimal}>.</span>
        <SingleDisplay value={decimalPart?.[0] || ''} />
        <SingleDisplay value={decimalPart?.[1] || ''} />
      </Group>
      {result && (
        <Group className={classes.resultGroup}>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <SingleDisplay
                // eslint-disable-next-line react/no-array-index-key
                key={`result-${index}-${result.amount}-${result.direction}`}
                value={
                  index < result.amount
                    ? result.direction === 'up'
                      ? '↑'
                      : '↓'
                    : ''
                }
              />
            ))}
        </Group>
      )}
    </Group>
  )
}
