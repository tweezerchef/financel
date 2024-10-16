'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserContext } from '../../context/user/UserContext'

export function AuthenticatedGame() {
  const { user } = useUserContext()
  const router = useRouter()

  useEffect(() => {
    if (user?.nextCategory) {
      let path
      switch (user.nextCategory) {
        case 'INTEREST_RATE':
          path = '/game/interestRate'
          break
        case 'CURRENCY':
          path = '/game/currency'
          break
        case 'STOCK':
          path = '/game/stock'
          break
        default:
          path = '/game/final'
      }
      router.push(path)
    }
    // Handle the case when nextCategory is null
    else router.push('/game/final')
  }, [user, router])

  // Render loading state or null while redirecting
  return <div>Loading...</div>
}
