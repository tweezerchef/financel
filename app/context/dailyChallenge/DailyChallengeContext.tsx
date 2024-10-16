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

  const setDailyChallengeAndStore = useCallback(
    (
      currency: CurrencyType | null,
      interestRate: InterestRateType | null,
      stock: StockType | null
    ) => {
      setDailyChallengeCurrency(currency)
      setDailyChallengeInterestRate(interestRate)
      setDailyChallengeStock(stock)
      if (currency && interestRate && stock)
        localStorage.setItem(
          'dailyChallenge',
          JSON.stringify({
            currency,
            interestRate,
            stock,
            lastFetched: new Date().toISOString(),
          })
        )
      else localStorage.removeItem('dailyChallenge')
    },
    []
  )

  const fetchDailyChallenge = useCallback(async () => {
    if (isLoading) return
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
      }

      setDailyChallengeAndStore(newCurrency, newInterestRate, newStock)
    } catch (error) {
      console.error('Error fetching daily challenge:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, setDailyChallengeAndStore])

  useEffect(() => {
    const storedChallenge = localStorage.getItem('dailyChallenge')
    if (storedChallenge) {
      const { currency, interestRate, stock, lastFetched } =
        JSON.parse(storedChallenge)
      const lastFetchedDate = new Date(lastFetched)
      const currentDate = new Date()

      // Check if the stored data is from today
      if (lastFetchedDate.toDateString() === currentDate.toDateString()) {
        setDailyChallengeCurrency(currency)
        setDailyChallengeInterestRate(interestRate)
        setDailyChallengeStock(stock)
      } else fetchDailyChallenge()
    } else fetchDailyChallenge()
  }, [fetchDailyChallenge])

  const value = useMemo(
    () => ({
      dailyChallengeCurrency,
      dailyChallengeInterestRate,
      dailyChallengeStock,
      setDailyChallengeCurrency: (currency: CurrencyType | null) =>
        setDailyChallengeAndStore(
          currency,
          dailyChallengeInterestRate,
          dailyChallengeStock
        ),
      setDailyChallengeInterestRate: (interestRate: InterestRateType | null) =>
        setDailyChallengeAndStore(
          dailyChallengeCurrency,
          interestRate,
          dailyChallengeStock
        ),
      setDailyChallengeStock: (stock: StockType | null) =>
        setDailyChallengeAndStore(
          dailyChallengeCurrency,
          dailyChallengeInterestRate,
          stock
        ),
      fetchDailyChallenge,
    }),
    [
      dailyChallengeCurrency,
      dailyChallengeInterestRate,
      dailyChallengeStock,
      fetchDailyChallenge,
      setDailyChallengeAndStore,
    ]
  )

  return (
    <DailyChallengeContext.Provider value={value}>
      {children}
    </DailyChallengeContext.Provider>
  )
}
