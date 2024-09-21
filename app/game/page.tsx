'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useLocalStorage } from './lib/useLocalStorage'

const AuthenticatedGame = dynamic(
  () =>
    import('./components/AuthenticatedGame').then(
      (mod) => mod.AuthenticatedGame
    ),
  { ssr: false }
)

export default function Game() {
  const router = useRouter()
  const [token, setToken, isLoading] = useLocalStorage('token')
  const [isTokenValid, setIsTokenValid] = useState(false)

  useEffect(() => {
    console.log('Game component mounted')
    console.log('Token:', token)
    console.log('Is loading:', isLoading)

    const validateToken = async () => {
      if (!token) {
        console.log('No token found, redirecting to login')
        router.push('/')
        return
      }

      try {
        // Here you would typically make an API call to validate the token
        // For now, we'll just simulate a validation check
        const isValid = token.length > 0 // Replace with actual validation logic
        console.log('Token validation result:', isValid)
        setIsTokenValid(isValid)

        if (!isValid) {
          console.log('Invalid token, clearing and redirecting to login')
          setToken(null)
          router.push('/')
        }
      } catch (error) {
        console.error('Error validating token:', error)
        setIsTokenValid(false)
        setToken(null)
        router.push('/')
      }
    }

    if (!isLoading) validateToken()
  }, [token, isLoading, router, setToken])

  if (isLoading) {
    console.log('Still loading...')
    return <div>Loading...</div>
  }

  if (!token || !isTokenValid) {
    console.log('No valid token, component will return null')
    return null
  }

  console.log('Rendering AuthenticatedGame')
  return <AuthenticatedGame />
}
