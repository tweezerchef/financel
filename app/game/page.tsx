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
  const { user, setUser } = useUserContext()

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch('/auth/api/refresh', {
          method: 'POST',
          credentials: 'include', // This is important to include cookies
        })

        if (response.ok) {
          const { token } = await response.json()
          // Store the token in memory (not localStorage)
          sessionStorage.setItem('accessToken', token)
          setIsAuthenticated(true)

          // If we don't have user data in context, fetch it
          if (!user) {
            // You'll need to implement this API endpoint
            const userResponse = await fetch('/api/user', {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (userResponse.ok) {
              const userData = await userResponse.json()
              setUser(userData)
            }
          }
        } else {
          console.log('Invalid session, redirecting to login')
          setUser(null)
          router.push('/')
        }
      } catch (error) {
        console.error('Error validating session:', error)
        setUser(null)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    validateSession()
  }, [router, setUser, user])

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) {
    console.log('Not authenticated, component will return null')
    return null
  }

  return <AuthenticatedGame />
}
