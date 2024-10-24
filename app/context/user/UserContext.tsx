/* eslint-disable consistent-return */

'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react'

type UserType = 'guest' | 'registered'
type Category = 'INTEREST_RATE' | 'CURRENCY' | 'STOCK'

interface UserData {
  googleId?: string
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
  clearUser: () => void
  updateUserResult: (resultId: string, nextCategory: Category | null) => void
  refreshUserData: () => Promise<void>
}

interface UserProviderProps {
  children: ReactNode
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (context === undefined)
    throw new Error('useUserContext must be used within a UserProvider')
  return context
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null)

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

  const clearUser = useCallback(() => {
    setUser(null)
  }, [])

  const updateUserResult = useCallback(
    (resultId: string, nextCategory: Category | null) => {
      setUser((prevUser) =>
        prevUser ? { ...prevUser, resultId, nextCategory } : null
      )
    },
    []
  )

  const refreshUserData = useCallback(async () => {
    try {
      const response = await fetch('/auth/api/verify', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else setUser(null)
    } catch (error) {
      console.error('Failed to refresh user data:', error)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    if (!user) refreshUserData()
  }, [user, refreshUserData])

  const value = useMemo(
    () => ({
      user,
      setUser,
      refreshSignedAvatarUrl,
      clearUser,
      updateUserResult,
      refreshUserData,
    }),
    [user, refreshSignedAvatarUrl, clearUser, updateUserResult, refreshUserData]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
