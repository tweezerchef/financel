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

  return (
    <Box className={classes.container}>
      <Group className={classes.guessGroup}>
        <SingleDisplay value={wholePart || ''} isSpinning={isSpinning} />
        <span className={classes.decimal}>.</span>
        <SingleDisplay value={decimalPart?.[0] || ''} isSpinning={isSpinning} />
        <SingleDisplay value={decimalPart?.[1] || ''} isSpinning={isSpinning} />
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
            />
          ))}
      </Group>
    </Box>
  )
}
