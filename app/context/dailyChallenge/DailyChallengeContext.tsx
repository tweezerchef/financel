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
  decimal: number
  range: number
  chartData: Array<{ date: string; value: number }>
  date: string
}

interface DailyChallengeCurrencyType {
  dailyChallengeCurrency: CurrencyType | null
  setDailyChallengeCurrency: (currency: CurrencyType | null) => void
  fetchDailyChallenge: () => Promise<void>
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

  const fetchDailyChallenge = useCallback(async () => {
    try {
      const response = await fetch('game/api/dailyChallenge')
      const { data } = await response.json()

      const newCurrency: CurrencyType = {
        currencyValue: parseFloat(data.currencyValue),
        currency: data.currency,
        challengeDate: new Date(data.date),
        decimal: data.decimal,
        chartData: data.chartData,
        date: data.date,
        range: data.range,
      }

      setDailyChallengeAndStore(newCurrency)
    } catch (error) {
      console.error('Error fetching daily challenge:', error)
    }
  }, [])

  useEffect(() => {
    const storedCurrency = localStorage.getItem('dailyChallengeCurrency')
    if (storedCurrency) {
      const parsedCurrency = JSON.parse(storedCurrency)
      setDailyChallengeCurrency(parsedCurrency)
    } else fetchDailyChallenge()
  }, [fetchDailyChallenge])

  const value = useMemo(
    () => ({
      dailyChallengeCurrency,
      setDailyChallengeCurrency: setDailyChallengeAndStore,
      fetchDailyChallenge,
    }),
    [dailyChallengeCurrency, fetchDailyChallenge]
  )

  return (
    <DailyChallengeContext.Provider value={value}>
      {children}
    </DailyChallengeContext.Provider>
  )
}
