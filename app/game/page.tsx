'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLocalStorage } from './lib/useLocalStorage'
import { InterestRateGuess } from './components/interestRate/InterestRateGuess'
import { InterestRateDayOf } from './components/interestRate/InterestRateDayOf'
import classes from './ui/Game.module.css'

export default function Game() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const token = useLocalStorage('token')

  useEffect(() => {
    if (token === null || !token) router.push('/')
    else setIsLoading(false)
  }, [token, router])

  if (isLoading) return <div>Loading...</div>

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
