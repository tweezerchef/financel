'use client'

import { Stack } from '@mantine/core'
import { InterestRateGuess } from './components/interestRate/InterestRateGuess'
import { InterestRateDayOf } from './components/interestRate/InterestRateDayOf'

export default function Game() {
  return (
    <Stack
      bg="var(--mantine-color-body)"
      align="center"
      justify="center"
      gap="sm"
    >
      <InterestRateGuess />
      <InterestRateDayOf />
    </Stack>
  )
}
