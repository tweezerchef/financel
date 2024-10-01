/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
import { FC, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Group, Box } from '@mantine/core'
import { SingleDisplay } from './SingleDisplay'
import classes from './ui/GuessDisplay.module.css'

interface GuessDisplayProps {
  guess: string
  result?: { amount: ResponseNumbers; direction: Direction } | null
  isSpinning: boolean
}

export const GuessDisplay: FC<GuessDisplayProps> = ({
  guess,
  result,
  isSpinning,
}) => {
  const [wholePart, decimalPart] = guess.split('.')
  const [displayedResults, setDisplayedResults] = useState<string[]>([])

  useEffect(() => {
    if (!isSpinning && result) {
      const resultArray = Array(result.amount).fill(
        result.direction === 'down' ? '↑' : '↓'
      )
      let currentIndex = 0

      const intervalID = setInterval(() => {
        if (currentIndex < resultArray.length) {
          setDisplayedResults((prev) => [...prev, resultArray[currentIndex]])
          currentIndex++
        } else clearInterval(intervalID)
      }, 200)

      return () => clearInterval(intervalID)
    }
    if (isSpinning) setDisplayedResults([])
  }, [isSpinning, result])

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
              value={displayedResults[index] || ''}
              isSpinning={isSpinning}
            />
          ))}
      </Group>
    </Box>
  )
}
