import { useRef, useEffect, useState } from 'react'
import { Container, Transition } from '@mantine/core'
import { StockDayOfImage } from './components/StockDayOfImage'
import { StockDayOfInfo } from './components/StockDayOfInfo'
import { useDailyChallengeContext } from '../../../context/dailyChallenge/DailyChallengeContext'
import classes from '../../ui/DayOf.module.css'

interface StockDayOfProps {
  amountAway: number | null
  guessCount: number | null
}

type DayOf = 'image' | 'day'

export function StockDayOf({ amountAway, guessCount }: StockDayOfProps) {
  const [dayOfSlide, setDayOfSlide] = useState<DayOf>('image')
  const [oldLegendContent, setOldLegendContent] = useState<string>('')
  const [newLegendContent, setNewLegendContent] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const legendRef = useRef<HTMLDivElement>(null)

  const { dailyChallengeStock } = useDailyChallengeContext()

  const { date, stockName } = dailyChallengeStock || {}

  useEffect(() => {
    if (dayOfSlide === 'image') {
      const timeoutId = setTimeout(() => {
        setDayOfSlide('day')
      }, 750)
      return () => clearTimeout(timeoutId)
    }
  }, [dayOfSlide])

  useEffect(() => {
    if (amountAway !== null && guessCount !== null) {
      const content = `${amountAway >= 50.01 ? 'Greater Than' : 'Less Than'}:
        ${amountAway >= 50.01 ? '50' : parseFloat(amountAway.toString())}
        Percent Away | Guesses Left: ${guessCount}`

      setOldLegendContent(newLegendContent || content)
      setNewLegendContent(content)
      setIsAnimating(true)

      const animationDuration = 1000

      const timeoutId = setTimeout(() => {
        setIsAnimating(false)
        setOldLegendContent(content)
      }, animationDuration)

      return () => clearTimeout(timeoutId)
    }
  }, [amountAway, guessCount, newLegendContent])

  return (
    <Container className={classes.dayOfContainer}>
      <div className={classes.slideWrapper}>
        <Transition
          mounted={dayOfSlide === 'image'}
          transition="slide-left"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles} className={classes.slide}>
              <StockDayOfImage />
            </div>
          )}
        </Transition>
        <Transition
          mounted={
            dayOfSlide === 'day' &&
            date !== undefined &&
            stockName !== undefined
          }
          transition="slide-left"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles} className={classes.slide}>
              <StockDayOfInfo date={date ?? ''} stockName={stockName ?? ''} />
            </div>
          )}
        </Transition>
      </div>
      <div className={classes.legend} ref={legendRef}>
        <div
          className={`${classes.legendContent} ${isAnimating ? classes.animate : ''}`}
        >
          <span>{oldLegendContent}</span>
          <span>{newLegendContent}</span>
        </div>
      </div>
    </Container>
  )
}
