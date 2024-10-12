/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Container, Transition } from '@mantine/core'
// import { DayOfImage } from './components/DayOfImage'
import classes from './ui/InterestRateDayOf.module.css'
// import { DayOfInfo } from './components/DayOfInfo'

interface CurrencyDayOfProps {
  setChallengeDate: React.Dispatch<React.SetStateAction<'image' | 'day'>>
  setInitialData: React.Dispatch<
    React.SetStateAction<Array<{ date: string; currency: number }>>
  >
  amountAway: string | null
  guessCount: number | null
}

export const CurrencyDayOf: React.FC<CurrencyDayOfProps> = ({
  setChallengeDate,
  setInitialData,
  amountAway,
  guessCount,
}) => {
  return <div>CurrencyDayOf</div>
}
