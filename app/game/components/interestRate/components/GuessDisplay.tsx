/* eslint-disable no-nested-ternary */
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Group, Box } from '@mantine/core'
import { SingleDisplay } from './SingleDisplay'
import classes from './ui/GuessDisplay.module.css'

interface GuessDisplayProps {
  guess: string
  result?: { amount: ResponseNumbers; direction: Direction } | null
  isSpinning: boolean
}

export const GuessDisplay: React.FC<GuessDisplayProps> = ({
  guess,
  result,
  isSpinning,
}) => {
  const [wholePart, decimalPart] = guess.split('.')
  const spinDuration = 1500 // 1.5 seconds of spinning

  return (
    <Box className={classes.container}>
      <Group className={classes.guessGroup}>
        <SingleDisplay
          value={wholePart || ''}
          isSpinning={isSpinning}
          spinDuration={spinDuration}
        />
        <span className={classes.decimal}>.</span>
        <SingleDisplay
          value={decimalPart?.[0] || ''}
          isSpinning={isSpinning}
          spinDuration={spinDuration}
        />
        <SingleDisplay
          value={decimalPart?.[1] || ''}
          isSpinning={isSpinning}
          spinDuration={spinDuration}
        />
      </Group>
      <Group className={classes.resultGroup}>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <SingleDisplay
              key={uuidv4()}
              value={
                result && index < result.amount
                  ? result.direction === 'up'
                    ? '↑'
                    : '↓'
                  : ''
              }
              isSpinning={isSpinning}
              spinDuration={spinDuration}
            />
          ))}
      </Group>
    </Box>
  )
}
