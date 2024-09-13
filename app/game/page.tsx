'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocalStorage } from './lib/useLocalStorage'
import { InterestRateGuess } from './components/interestRate/InterestRateGuess'
import { InterestRateDayOf } from './components/interestRate/InterestRateDayOf'
import classes from './ui/Game.module.css'

export default function Game() {
  const router = useRouter()

  const token = useLocalStorage('token')

  useEffect(() => {
    if (!token) router.push('/')
  }, [token, router])

  if (!token)
    // Optionally, you can return null or a loading state here
    return <div>You are not authenticated</div>

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
