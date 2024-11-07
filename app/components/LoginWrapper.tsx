'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'

import type { LoginProps } from './Login'

const Login = dynamic<LoginProps>(
  () =>
    import('./Login').then((mod) => {
      return mod.Login
    }),
  {
    loading: () => <div>Loading...</div>,
    ssr: true,
  }
)

const LoadingOverlay = dynamic(
  () =>
    import('./LoadingOverlay').then((mod) => {
      return mod.LoadingOverlay
    }),
  {
    ssr: true,
  }
)

export function LoginWrapper() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleAuthStart = () => {
    setIsAuthenticating((prev) => !prev)
  }

  return (
    <>
      <Login
        onAuthStart={handleAuthStart}
        isAuthenticating={isAuthenticating}
      />
      {isAuthenticating && (
        <Suspense fallback={null}>
          <LoadingOverlay />
        </Suspense>
      )}
    </>
  )
}
