/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */

'use client'

import React, { useState, useEffect } from 'react'
import { Group } from '@mantine/core'
import { SingleDisplay } from './SingleDisplay'
import classes from './ui/GuessDisplay.module.css'

interface GuessDisplayProps {
  guess: string
  result?: { amount: ResponseNumbers; direction: Direction } | null
  isActive: boolean
  onAnimationComplete: () => void
}

export const GuessDisplay: React.FC<GuessDisplayProps> = ({
  guess,
  result,
  isActive,
  onAnimationComplete,
}) => {
  const [wholePart, decimalPart] = guess.split('.')
  const [isFlipping, setIsFlipping] = useState(false)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    if (isActive && result) {
      setIsFlipping(true)
      const timer = setTimeout(() => {
        setIsFlipping(false)
        setShowResult(true)
        onAnimationComplete()
      }, 600) // Match this with the CSS transition duration
      return () => clearTimeout(timer)
    }
  }, [isActive, result, onAnimationComplete])

  return (
    <Group className={classes.container} justify="center" gap="xs">
      <Group className={classes.guessGroup}>
        <SingleDisplay value={wholePart || ''} isFlipping={isFlipping} />
        <span className={classes.decimal}>.</span>
        <SingleDisplay value={decimalPart?.[0] || ''} isFlipping={isFlipping} />
        <SingleDisplay value={decimalPart?.[1] || ''} isFlipping={isFlipping} />
      </Group>
      <Group className={classes.resultGroup}>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <SingleDisplay
              // eslint-disable-next-line react/no-array-index-key
              key={`result-${index}`}
              value={
                showResult && result && index < result.amount
                  ? result.direction === 'up'
                    ? '↑'
                    : '↓'
                  : ''
              }
              isFlipping={isFlipping}
            />
          ))}
      </Group>
    </Group>
  )
}
