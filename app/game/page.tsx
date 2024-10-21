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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, setUser, clearUser } = useUserContext()

  useEffect(() => {
    const validateSession = async () => {
      try {
        const verifyRoute =
          user?.type === 'guest'
            ? '/auth/api/verify/guest'
            : '/auth/api/verify/user'
        const response = await fetch(verifyRoute, {
          method: 'POST',
          credentials: 'include',
        })

        if (response.ok) {
          const userData = await response.json()
          setIsAuthenticated(true)
          setUser({
            id: userData.id,
            type: userData.type,
            resultId: userData.resultId,
            nextCategory: userData.nextCategory,
            username: userData.username,
            signedAvatarUrl: userData.signedAvatarUrl,
            signedAvatarExpiration: userData.signedAvatarExpiration,
          })
        } else throw new Error('Invalid session')
      } catch (error) {
        console.error('Error validating session:', error)
        clearUser()
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    validateSession()
  }, [router, setUser, clearUser, user])

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login')
    return null
  }

  return <AuthenticatedGame />
}
