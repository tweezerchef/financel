'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useUserContext } from '../context/user/UserContext'

const AuthenticatedGame = dynamic(
  () =>
    import('./components/AuthenticatedGame').then(
      (mod) => mod.AuthenticatedGame
    ),
  { ssr: false }
)

export default function Game() {
  const router = useRouter()
  const { user } = useUserContext()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated' && !user) {
      console.log('No authenticated user found, redirecting to login')
      router.push('/')
    }
  }, [status, user, router])

  if (status === 'loading') return <div>Loading...</div>

  if (!user) {
    console.log('No user data, component will return null')
    return null
  }

  return <AuthenticatedGame />
}
