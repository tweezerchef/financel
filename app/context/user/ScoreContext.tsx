'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
  FC,
} from 'react'

type Category = 'INTEREST_RATE' | 'CURRENCY' | 'STOCK' | 'FINAL'

interface ScoreContextType {
  interestScore: number
  currencyScore: number
  stockScore: number
  finalScore: number
  averageInterestRate: number
  averageCurrency: number
  averageStock: number
  averageFinal: number
  updateScore: (category: Category, amount: number) => void
  refreshScore: (resultId: string) => Promise<void>
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
      case 'FINAL':
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
      case 'FINAL':
        setFinalScore(amount)
        break
      default:
        throw new Error(`Unknown category: ${category}`)
    }
  }, [])
  const refreshScore = useCallback(
    async (resultId: string) => {
      try {
        const scoreResponse = await fetch(
          `/context/user/api/userScore?resultId=${resultId}`,
          {
            credentials: 'include',
          }
        )
        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json()
          if (Array.isArray(scoreData.categoryScores))
            scoreData.categoryScores.forEach(
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
                  case 'FINAL':
                    setFinalScore(cat.score)
                    break
                  default:
                    console.warn(`Unknown category: ${cat.category}`)
                }
              }
            )
        }

        const averageResponse = await fetch('/context/user/api/average', {
          credentials: 'include',
        })
        if (averageResponse.ok) {
          const averageData = await averageResponse.json()
          if (Array.isArray(averageData.categoryAverages))
            averageData.categoryAverages.forEach(
              (cat: { category: string; average: number }) => {
                updateAverage(cat.category as Category, cat.average)
              }
            )

          if (averageData.finalAverage !== undefined)
            updateAverage('FINAL', averageData.finalAverage)
        }
      } catch (error) {
        console.error('Failed to refresh score and averages:', error)
      }
    },
    [updateAverage]
  )

  // useEffect(() => {
  //   refreshScore()
  // }, [refreshScore])

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
