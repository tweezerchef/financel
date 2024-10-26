'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
  FC,
  useEffect,
} from 'react'

type Category = 'INTEREST_RATE' | 'CURRENCY' | 'STOCK' | 'Final'

interface ScoreContextType {
  interestScore: number
  currencyScore: number
  stockScore: number
  finalScore: number
  averageInterestRate: number
  updateScore: (category: Category, amount: number) => void
}
interface ScoreProviderProps {
  children: ReactNode
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined)

export const useScoreContext = () => {
  const context = useContext(ScoreContext)
  if (context === undefined)
    throw new Error('useScoreContext must be used within a ScoreProvider')
  return context
}

export const ScoreProvider: FC<ScoreProviderProps> = ({ children }) => {
  const [interestScore, setInterestScore] = useState(0)
  const [currencyScore, setCurrencyScore] = useState(0)
  const [stockScore, setStockScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [averageInterestRate, setAverageInterestRate] = useState(0)
  const [averageCurrency, setAverageCurrency] = useState(0)
  const [averageStock, setAverageStock] = useState(0)
  const [averageFinal, setAverageFinal] = useState(0)
  const updateAverage = useCallback((category: Category, amount: number) => {
    switch (category) {
      case 'INTEREST_RATE':
        setAverageInterestRate(amount)
        break
      case 'CURRENCY':
        setAverageCurrency(amount)
        break
      case 'STOCK':
        setAverageStock(amount)
        break
      case 'Final':
        setAverageFinal(amount)
        break
      default:
        throw new Error(`Unknown category: ${category}`)
    }
  }, [])
  const updateScore = useCallback((category: Category, amount: number) => {
    switch (category) {
      case 'INTEREST_RATE':
        setInterestScore(amount)
        break
      case 'CURRENCY':
        setCurrencyScore(amount)
        break
      case 'STOCK':
        setStockScore(amount)
        break
      case 'Final':
        setFinalScore(amount)
        break
      default:
        throw new Error(`Unknown category: ${category}`)
    }
  }, [])
  const refreshScore = useCallback(async () => {
    try {
      const response = await fetch('/auth/api/verify/score', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        // Update this part to correctly set individual category scores
        if (Array.isArray(data.categoryScores))
          data.categoryScores.forEach(
            (cat: { category: string; score: number }) => {
              switch (cat.category) {
                case 'INTEREST_RATE':
                  setInterestScore(cat.score)
                  break
                case 'CURRENCY':
                  setCurrencyScore(cat.score)
                  break
                case 'STOCK':
                  setStockScore(cat.score)
                  break
                default:
                  console.warn(`Unknown category: ${cat.category}`)
              }
            }
          )

        setFinalScore(data.finalScore || 0)
      }
    } catch (error) {
      console.error('Failed to refresh score:', error)
    }
  }, [])

  useEffect(() => {
    if (
      interestScore === 0 &&
      currencyScore === 0 &&
      stockScore === 0 &&
      finalScore === 0
    ) {
      console.log('refreshing score')
      refreshScore()
    }
  }, [refreshScore, interestScore, currencyScore, stockScore, finalScore])

  const scoreValues = useMemo(
    () => ({
      interestScore,
      currencyScore,
      stockScore,
      finalScore,
      averageInterestRate,
      averageCurrency,
      averageStock,
      averageFinal,
      updateAverage,
      updateScore,
      refreshScore,
    }),
    [
      interestScore,
      currencyScore,
      stockScore,
      finalScore,
      averageInterestRate,
      averageCurrency,
      averageStock,
      averageFinal,
      updateScore,
      updateAverage,
      refreshScore,
    ]
  )

  return (
    <ScoreContext.Provider value={scoreValues}>
      {children}
    </ScoreContext.Provider>
  )
}
