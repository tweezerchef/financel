'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useUserContext } from '../context/user/UserContext'

const AuthenticatedGame = dynamic(
  () =>
    import('./components/AuthenticatedGame').then(
      (mod) => mod.AuthenticatedGame
    ),
  { ssr: false }
)

export default function Game() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { user, refreshUserData } = useUserContext()

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch('/auth/api/verify', {
          method: 'GET',
          credentials: 'include', // This ensures cookies are sent with the ∂request
        })

        if (!response.ok) throw new Error('Invalid session')

        if (!user) await refreshUserData()
      } catch (error) {
        console.error('Error validating session:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    validateSession()
  }, [user, refreshUserData, router])

  if (isLoading) return <div>Loading...</div>

  if (!user) return null

  return <AuthenticatedGame />
}
