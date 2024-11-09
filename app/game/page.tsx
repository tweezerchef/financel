'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useUserContext } from '../context/user/UserContext'

export default function Game() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { user, refreshUserData } = useUserContext()

  useEffect(() => {
    const validateAndRoute = async () => {
      try {
        // Validate session
        const response = await fetch('/auth/api/verify', {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) throw new Error('Invalid session')

        if (!user) await refreshUserData()

        // Handle routing based on nextCategory
        const path = user?.nextCategory
          ? ({
              INTEREST_RATE: '/game/interestRate',
              CURRENCY: '/game/currency',
              STOCK: '/game/stock',
            }[user.nextCategory] ?? '/game/final')
          : '/game/final'

        router.push(path)
      } catch (error) {
        console.error('Error validating session:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    validateAndRoute()
  }, [user, refreshUserData, router])

  if (isLoading) return <div>Loading...</div>

  return null
}
