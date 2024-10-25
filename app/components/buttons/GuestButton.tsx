'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@mantine/core'
import classes from './ui/GuestButton.module.css'
import { useUserContext } from '../../context/user/UserContext'

interface GuestButtonProps {
  onAuthStart: () => void
  isAuthenticating?: boolean
}

export const GuestButton = ({
  onAuthStart,
  isAuthenticating = false,
}: GuestButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useUserContext()

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      console.log('Attempting guest login')
      const response = await fetch('/auth/api/guest', {
        method: 'POST',
      })
      const data = await response.json()
      console.log('Guest login response:', data)
      if (response.ok) {
        console.log('Guest login successful, setting user data')
        setUser({
          id: data.id,
          type: 'guest',
          resultId: data.resultId,
          nextCategory: data.nextCategory,
          signedAvatarUrl: null,
          signedAvatarExpiration: null,
          username: null,
        })
        console.log('Redirecting to game page')
        router.push(`/game`)
      } else {
        console.error('Guest login failed:', data.message)
        alert(data.message)
        onAuthStart()
      }
    } catch (error) {
      console.error('Guest login error:', error)
      alert('An error occurred during guest login.')
      onAuthStart()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className={classes.control}
      variant="blue"
      size="lg"
      onClick={handleGuestLogin}
      disabled={isLoading || isAuthenticating}
    >
      {isLoading ? 'Logging in...' : 'Continue as Guest'}
    </Button>
  )
}
