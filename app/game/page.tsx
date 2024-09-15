'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from './lib/useLocalStorage'
import { InterestRateGuess } from './components/interestRate/InterestRateGuess'
import { InterestRateDayOf } from './components/interestRate/InterestRateDayOf'
import classes from './ui/Game.module.css'

export default function Game() {
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken, isLoading] = useLocalStorage('token')

  useEffect(() => {
    if (!isLoading && !token) router.push('/')
  }, [isLoading, token, router])

  if (isLoading) return <div>Loading...</div>

  if (!token) return <div>You are not authenticated</div>

  return (
    <div className={classes.container}>
      <div className={classes.dayOf}>
        <InterestRateDayOf />
      </div>
      <div className={classes.guess}>
        <InterestRateGuess />
      </div>
    </div>
  )
}
