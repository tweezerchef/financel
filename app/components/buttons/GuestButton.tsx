'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@mantine/core'
import classes from './ui/GoogleButton.module.css'

export const GuestButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/auth/api/guest', {
        method: 'POST',
      })
      const data = await response.json()
      if (response.ok) {
        // Store the token in localStorage or a secure cookie
        localStorage.setItem('guestToken', data.token)
        router.push('/game')
      } else alert(data.message)
    } catch (error) {
      console.error('Guest login error:', error)
      alert('An error occurred during guest login.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className={classes.control}
      variant="white"
      size="lg"
      onClick={handleGuestLogin}
      disabled={isLoading}
    >
      {isLoading ? 'Logging in...' : 'Continue as Guest'}
    </Button>
  )
}
