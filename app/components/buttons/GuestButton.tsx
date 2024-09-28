'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@mantine/core'
import classes from './ui/GoogleButton.module.css'
import { useUserContext } from '../../context/user/UserContext'

export const GuestButton = () => {
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
        console.log('Guest login successful, setting token')
        localStorage.setItem('guestToken', data.token)
        setUser({ id: data.id, type: 'guest', resultId: data.resultId })
        console.log('Redirecting to game page')
        router.push('/game')
      } else {
        console.error('Guest login failed:', data.message)
        alert(data.message)
      }
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
