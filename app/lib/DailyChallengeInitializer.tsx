'use client'

import { useEffect } from 'react'
import { useDailyChallengeContext } from '../context/dailyChallenge/DailyChallengeContext'

export function DailyChallengeInitializer({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    dailyChallengeCurrency,
    dailyChallengeInterestRate,
    dailyChallengeStock,
    fetchDailyChallenge,
  } = useDailyChallengeContext()

  useEffect(() => {
    if (
      !dailyChallengeCurrency ||
      !dailyChallengeInterestRate ||
      !dailyChallengeStock
    )
      fetchDailyChallenge()
  }, [
    dailyChallengeCurrency,
    dailyChallengeInterestRate,
    dailyChallengeStock,
    fetchDailyChallenge,
  ])

  return children
}
