/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Container, Transition } from '@mantine/core'
import { CurrencyDayOfImage } from './components/CurrencyDayOfImage'
import classes from './ui/CurrencyDayOf.module.css'
import { CurrencyDayOfInfo } from './components/CurrencyDayOfInfo'
import { useDailyChallengeContext } from '../../../context/dailyChallenge/DailyChallengeContext'
import { formatDate } from '../../lib/formatDate'
import { addOrdinalSuffix } from '../../lib/addOrdinalSuffix'

interface CurrencyDayOfProps {
  amountAway: string | null
  guessCount: number | null
}

type DayOf = 'image' | 'day'
interface ChallengeDateType {
  currency: string
  date: string
  chartData: Array<unknown>
  decimal: number
}

export function CurrencyDayOf({ amountAway, guessCount }: CurrencyDayOfProps) {
  const [dayOfSlide, setDayOfSlide] = useState<DayOf>('image')
  const { dailyChallengeCurrency } = useDailyChallengeContext()

  const challengeData = dailyChallengeCurrency as ChallengeDateType | null

  const { currency, date: challengeDate } = challengeData || {}

  const formattedDate = challengeDate ? formatDate(challengeDate) : null

  const finalDate = formattedDate
    ? (() => {
        const [month, dayWithComma, year] = formattedDate.split(' ')
        const day = parseInt(dayWithComma, 10)
        const dayWithSuffix = addOrdinalSuffix(day)
        return `${month} ${dayWithSuffix}, ${year}`
      })()
    : null
  useEffect(() => {
    if (dayOfSlide === 'image') {
      const timeoutId = setTimeout(() => {
        setDayOfSlide('day')
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [dayOfSlide, setDayOfSlide])

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
          mounted={
            dayOfSlide === 'day' && finalDate !== null && currency !== null
          }
          transition="slide-left"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <div style={styles} className={classes.slide}>
              {finalDate && currency && (
                <CurrencyDayOfInfo date={finalDate} currency={currency} />
              )}
            </div>
          )}
        </Transition>
      </div>
    </Container>
  )
}
