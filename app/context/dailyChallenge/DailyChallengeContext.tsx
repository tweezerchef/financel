/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react'

type ChallengeDateType = Date

interface CurrencyType {
  currencyValue: number
  currency: string
  challengeDate: ChallengeDateType
  decimalPlace: number
  yearData: Array<{ date: string; currency: number }>
}
interface DailyChallengeCurrencyType {
  dailyChallengeCurrency: CurrencyType | null
  setDailyChallengeCurrency: (currency: CurrencyType | null) => void
}

interface ChallengeProviderProps {
  children: ReactNode
}

type CategoryType = 'INTEREST_RATE' | 'CURRENCY' | 'STOCK'

const DailyChallengeContext = createContext<
  DailyChallengeCurrencyType | undefined
>(undefined)

export const useDailyChallengeContext = () => {
  const context = useContext(DailyChallengeContext)
  if (context === undefined)
    throw new Error(
      'useDailyChallengeContext must be used within a DailyChallengeProvider'
    )

  return context
}

export const DailyChallengeProvider: React.FC<ChallengeProviderProps> = ({
  children,
}) => {
  const [dailyChallengeCurrency, setDailyChallengeCurrency] =
    useState<CurrencyType | null>(null)

  const setDailyChallengeAndStore = (currency: CurrencyType | null) => {
    setDailyChallengeCurrency(currency)
    if (currency)
      localStorage.setItem('dailyChallengeCurrency', JSON.stringify(currency))
    else localStorage.removeItem('dailyChallengeCurrency')
  }

  const value = useMemo(
    () => ({
      dailyChallengeCurrency,
      setDailyChallengeCurrency: setDailyChallengeAndStore,
    }),
    [dailyChallengeCurrency]
  )

  useEffect(() => {
    const storedCurrency = localStorage.getItem('dailyChallengeCurrency')
    if (storedCurrency) setDailyChallengeCurrency(JSON.parse(storedCurrency))
  }, [])

  return (
    <DailyChallengeContext.Provider value={value}>
      {children}
    </DailyChallengeContext.Provider>
  )
}
