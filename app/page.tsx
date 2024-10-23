'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { Login } from './components/Login'
import { LoadingOverlay } from './components/LoadingOverlay'
import classes from './ui/Page.module.css'

export default function Home() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  return (
    <main className={classes.main}>
      <Header />
      <Login onAuthStart={() => setIsAuthenticating(true)} />
      {isAuthenticating && <LoadingOverlay />}
    </main>
  )
}
