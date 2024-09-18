// app/game/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
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
  const [token, , isLoading] = useLocalStorage('token')

  if (isLoading) return <div>Loading...</div>

  if (!token) {
    router.push('/')
    return null
  }

  return <AuthenticatedGame />
}
