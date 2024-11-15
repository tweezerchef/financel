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
  const now = new Date()
  // Get start of day for dateOnly
  const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/auth/api/guest', {
        method: 'POST',
        body: JSON.stringify({ dateOnly: dateOnly.toISOString() }),
      })
      const data = await response.json()

      if (response.ok) {
        setUser({
          id: data.id,
          type: 'guest',
          resultId: data.resultId,
          nextCategory: data.nextCategory,
          signedAvatarUrl: null,
          signedAvatarExpiration: null,
          username: null,
          avatarUrl: null,
        })
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
      size="sm"
      onClick={handleGuestLogin}
      disabled={isLoading || isAuthenticating}
    >
      {isLoading ? 'Logging in...' : 'Continue as Guest'}
    </Button>
  )
}
