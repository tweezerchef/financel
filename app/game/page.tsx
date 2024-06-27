'use client'

import { useRouter } from 'next/navigation'
import { useLocalStorage } from './lib/useLocalStorage'
import { InterestRateGuess } from './components/interestRate/InterestRateGuess'
import { InterestRateDayOf } from './components/interestRate/InterestRateDayOf'
import classes from './ui/Game.module.css'

export default function Game() {
  const router = useRouter()
  const token = useLocalStorage('token')

  if (token === null) {
    router.push('/')
    return <div>You are not authenticated</div>
  }
  if (!token) {
    router.push('/')
    return <div>You are not authenticated</div>
  }

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
