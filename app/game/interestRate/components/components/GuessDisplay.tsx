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
  const [displayedResults, setDisplayedResults] = useState<
    Array<{ id: string; value: string }>
  >([])

  useEffect(() => {
    if (!isSpinning && result) {
      const resultArray = Array(result.amount).fill(
        result.direction === 'down' ? '↑' : '↓'
      )
      let currentIndex = 0

      const intervalID = setInterval(() => {
        if (currentIndex < resultArray.length) {
          setDisplayedResults((prev) => [
            ...prev,
            { id: uuidv4(), value: resultArray[currentIndex] },
          ])
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
        {displayedResults.map(({ id, value }) => (
          <SingleDisplay key={id} value={value} isSpinning={false} />
        ))}
        {Array(5 - displayedResults.length)
          .fill(null)
          .map(() => (
            <SingleDisplay key={uuidv4()} value="" isSpinning={isSpinning} />
          ))}
      </Group>
    </Box>
  )
}
