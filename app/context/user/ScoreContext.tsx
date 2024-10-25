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

type Category = 'Interest Rate' | 'Currency' | 'Stock'

interface ScoreContextType {
  interestScore: number
  currencyScore: number
  stockScore: number
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

  const updateScore = useCallback((category: Category, amount: number) => {
    switch (category) {
      case 'Interest Rate':
        console.log('Updating interest score:', amount)
        setInterestScore((prevScore) => prevScore + amount)
        break
      case 'Currency':
        setCurrencyScore((prevScore) => prevScore + amount)
        break
      case 'Stock':
        setStockScore((prevScore) => prevScore + amount)
        break
      default:
        throw new Error(`Unknown category: ${category}`)
    }
  }, [])

  const scoreValues = useMemo(
    () => ({ interestScore, currencyScore, stockScore, updateScore }),
    [interestScore, currencyScore, stockScore, updateScore]
  )

  return (
    <ScoreContext.Provider value={scoreValues}>
      {children}
    </ScoreContext.Provider>
  )
}
