/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useRef, useEffect, useState } from 'react'
import { Container, Transition } from '@mantine/core'
import { CurrencyDayOfImage } from './components/CurrencyDayOfImage'
import classes from './ui/CurrencyDayOf.module.css'
import { CurrencyDayOfInfo } from './components/CurrencyDayOfInfo'
import { useDailyChallengeContext } from '../../../context/dailyChallenge/DailyChallengeContext'

interface CurrencyDayOfProps {
  amountAway: number | null
  guessCount: number | null
}

type DayOf = 'image' | 'day'

export function CurrencyDayOf({ amountAway, guessCount }: CurrencyDayOfProps) {
  const [dayOfSlide, setDayOfSlide] = useState<DayOf>('image')
  const [oldLegendContent, setOldLegendContent] = useState<string>('')
  const [newLegendContent, setNewLegendContent] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const legendRef = useRef<HTMLDivElement>(null)

  const { dailyChallengeCurrency } = useDailyChallengeContext()

  const { currency, date } = dailyChallengeCurrency || {}

  useEffect(() => {
    if (dayOfSlide === 'image') {
      const timeoutId = setTimeout(() => {
        setDayOfSlide('day')
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [dayOfSlide, setDayOfSlide])

  useEffect(() => {
    if (amountAway !== null && guessCount !== null) {
      const content = `${amountAway >= 50.01 ? 'Greater Than' : 'Less Than'}:
        ${amountAway >= 50.01 ? '50' : parseFloat(amountAway.toString())}
        Percent Away | Guesses Left: ${guessCount}`

      setOldLegendContent(newLegendContent || content)
      setNewLegendContent(content)
      setIsAnimating(true)

      const animationDuration = 1000
      setTimeout(() => {
        setIsAnimating(false)
        setOldLegendContent(content)
      }, animationDuration)
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
              <CurrencyDayOfImage />
            </div>
          )}
        </Transition>

        <Transition
          mounted={dayOfSlide === 'day' && date !== null && currency !== null}
          transition="slide-left"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles} className={classes.slide}>
              {date && currency && (
                <CurrencyDayOfInfo date={date} currency={currency} />
              )}
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
