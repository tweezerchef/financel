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

interface InterestRateType {
  interestRate: number
  category: string
  challengeDate: ChallengeDateType
  chartData: Array<{ date: string; interestRate: number }>
  date: string
}

interface StockType {
  stockPrice: number
  stockName: string
  challengeDate: ChallengeDateType
  chartData: Array<{ date: string; price: number }>
  date: string
  decimal: number
}

interface DailyChallengeContextType {
  dailyChallengeCurrency: CurrencyType | null
  dailyChallengeInterestRate: InterestRateType | null
  dailyChallengeStock: StockType | null
  setDailyChallengeCurrency: (currency: CurrencyType | null) => void
  setDailyChallengeInterestRate: (interestRate: InterestRateType | null) => void
  setDailyChallengeStock: (stock: StockType | null) => void
  fetchDailyChallenge: () => Promise<void>
}

interface ChallengeProviderProps {
  children: ReactNode
}

const DailyChallengeContext = createContext<
  DailyChallengeContextType | undefined
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
  const [dailyChallengeInterestRate, setDailyChallengeInterestRate] =
    useState<InterestRateType | null>(null)
  const [dailyChallengeStock, setDailyChallengeStock] =
    useState<StockType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchDailyChallenge = useCallback(async () => {
    if (isLoading) return

    // Check if data already exists in context
    if (
      dailyChallengeCurrency &&
      dailyChallengeInterestRate &&
      dailyChallengeStock
    )
      return

    setIsLoading(true)
    try {
      const response = await fetch('/game/api/dailyChallenge')
      const { data } = await response.json()

      const newCurrency: CurrencyType = {
        currencyValue: parseFloat(data.currencyValue),
        currency: data.currency,
        challengeDate: new Date(data.date),
        decimal: data.currencyDecimal,
        chartData: data.currencyChartData,
        date: data.date,
        range: data.currencyRange,
      }
      const newInterestRate: InterestRateType = {
        interestRate: parseFloat(data.interestRate),
        category: data.interestRateCategory,
        challengeDate: new Date(data.date),
        chartData: data.interestRateChartData,
        date: data.date,
      }

      const newStock: StockType = {
        stockPrice: parseFloat(data.stockPrice),
        stockName: data.stockName,
        challengeDate: new Date(data.date),
        chartData: data.stockChartData,
        date: data.date,
        decimal: data.stockDecimal,
      }

      setDailyChallengeCurrency(newCurrency)
      setDailyChallengeInterestRate(newInterestRate)
      setDailyChallengeStock(newStock)
    } catch (error) {
      console.error('Error fetching daily challenge:', error)
    } finally {
      setIsLoading(false)
    }
  }, [
    isLoading,
    dailyChallengeCurrency,
    dailyChallengeInterestRate,
    dailyChallengeStock,
  ])

  const value = useMemo(
    () => ({
      dailyChallengeCurrency,
      dailyChallengeInterestRate,
      dailyChallengeStock,
      setDailyChallengeCurrency,
      setDailyChallengeInterestRate,
      setDailyChallengeStock,
      fetchDailyChallenge,
    }),
    [
      dailyChallengeCurrency,
      dailyChallengeInterestRate,
      dailyChallengeStock,
      fetchDailyChallenge,
    ]
  )

  return (
    <DailyChallengeContext.Provider value={value}>
      {children}
    </DailyChallengeContext.Provider>
  )
}
