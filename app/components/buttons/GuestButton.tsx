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
      const response = await fetch('/auth/api/guest', {
        method: 'POST',
      })
      const data = await response.json()
      if (response.ok) {
        console.log('Guest login successful:', data)
        localStorage.setItem('guestToken', data.token)
        setUser({ id: data.id, type: 'guest' })
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