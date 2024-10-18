/* eslint-disable consistent-return */

'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { useSession } from 'next-auth/react'

type UserType = 'guest' | 'registered'
type Category = 'INTEREST_RATE' | 'CURRENCY' | 'STOCK'

interface UserData {
  id: string
  type: UserType
  resultId: string
  nextCategory: Category | null
  username: string | null
  signedAvatarUrl: string | null
  signedAvatarExpiration: number | null
}

interface UserContextType {
  user: UserData | null
  setUser: (userData: UserData | null) => void
  refreshSignedAvatarUrl: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (context === undefined)
    throw new Error('useUserContext must be used within a UserProvider')

  return context
}

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user?.id)
        try {
          const response = await fetch('/auth/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Include the session token if needed
            // body: JSON.stringify({ sessionToken: session.accessToken }),
          })
          if (response.ok) {
            const userData = await response.json()
            setUser({
              id: userData.id,
              type: 'registered',
              resultId: userData.resultId,
              nextCategory: userData.nextCategory,
              username: userData.username,
              signedAvatarUrl: userData.signedAvatarUrl,
              signedAvatarExpiration: userData.signedAvatarExpiration,
            })
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      else if (status === 'unauthenticated') setUser(null)
    }

    fetchUserData()
  }, [status, session])

  const refreshSignedAvatarUrl = useCallback(async () => {
    if (user?.signedAvatarUrl)
      try {
        const response = await fetch('/auth/api/refreshAvatarUrl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarKey: user.signedAvatarUrl }),
        })
        if (response.ok) {
          const { signedUrl, expiresAt } = await response.json()
          setUser((prevUser) => ({
            ...prevUser!,
            signedAvatarUrl: signedUrl,
            signedAvatarExpiration: expiresAt,
          }))
        }
      } catch (error) {
        console.error('Failed to refresh signed avatar URL:', error)
      }
  }, [user?.signedAvatarUrl])

  const value = useMemo(
    () => ({
      user,
      setUser,
      refreshSignedAvatarUrl,
    }),
    [refreshSignedAvatarUrl, user]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
