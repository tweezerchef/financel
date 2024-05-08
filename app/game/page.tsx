'use client'

import { Stack } from '@mantine/core'
import { InterestRateGuess } from './components/interestRate/InterestRateGuess'
import { InterestRateDayOf } from './components/interestRate/InterestRateDayOf'

export default function Game() {
  return (
    <Stack
      style={{ height: '100%' }}
      bg="var(--mantine-color-body)"
      align="center"
      justify="center"
      gap="sm"
    >
      <div style={{ height: '25%' }}>
        <InterestRateDayOf />
      </div>
      <div style={{ height: '75%' }}>
        <InterestRateGuess />
      </div>
    </Stack>
  )
}
