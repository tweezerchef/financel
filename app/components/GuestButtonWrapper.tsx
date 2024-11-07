'use client'

import { useState } from 'react'
import { GuestButton } from './buttons/GuestButton'

export function GuestButtonWrapper() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleAuthStart = () => {
    setIsAuthenticating((prev) => !prev)
  }

  return (
    <GuestButton
      onAuthStart={handleAuthStart}
      isAuthenticating={isAuthenticating}
    />
  )
}
