// page.tsx

'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { Login } from './components/Login'
import { LoadingOverlay } from './components/LoadingOverlay'
import classes from './ui/Page.module.css'

export default function Home() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleAuthStart = () => {
    setIsAuthenticating((prev) => !prev)
  }

  return (
    <main className={classes.main}>
      <Header />
      <Login
        onAuthStart={handleAuthStart}
        isAuthenticating={isAuthenticating}
      />
      {isAuthenticating && <LoadingOverlay />}
    </main>
  )
}
