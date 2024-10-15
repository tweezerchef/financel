'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useLocalStorage } from './lib/useLocalStorage'
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
  const [token, , tokenIsLoading] = useLocalStorage('token')
  const [guestToken, , guestTokenIsLoading] = useLocalStorage('guestToken')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { setUser } = useUserContext()

  useEffect(() => {
    const validateToken = async () => {
      if (tokenIsLoading || guestTokenIsLoading) {
        console.log('Tokens still loading, waiting...')
        return
      }

      if (!token && !guestToken) {
        console.log('No tokens found, redirecting to login')
        router.push('/')
        return
      }

      const activeToken = token || guestToken

      try {
        // Here you would typically make an API call to validate the token
        // For now, we'll just check if it exists
        const isValid = !!activeToken
        console.log('Token validation result:', isValid)

        if (isValid) setIsAuthenticated(true)
        else {
          console.log('Invalid token, clearing and redirecting to login')
          localStorage.removeItem('token')
          localStorage.removeItem('guestToken')
          setUser(null)
          router.push('/')
        }
      } catch (error) {
        console.error('Error validating token:', error)
        setIsAuthenticated(false)
        localStorage.removeItem('token')
        localStorage.removeItem('guestToken')
        setUser(null)
        router.push('/')
      }
    }

    validateToken()
  }, [token, guestToken, tokenIsLoading, guestTokenIsLoading, router, setUser])

  if (tokenIsLoading || guestTokenIsLoading) return <div>Loading...</div>

  if (!isAuthenticated) {
    console.log('Not authenticated, component will return null')
    return null
  }

  return <AuthenticatedGame />
}
