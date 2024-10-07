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

  useEffect(() => {
    // Load user data from localStorage on initial render
    const storedUser = localStorage.getItem('userData')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  useEffect(() => {
    if (user?.signedAvatarExpiration) {
      const timeUntilExpiration = user.signedAvatarExpiration - Date.now()
      if (timeUntilExpiration > 0) {
        const timer = setTimeout(refreshSignedAvatarUrl, timeUntilExpiration)
        return () => clearTimeout(timer)
      }
      refreshSignedAvatarUrl()
    }
  }, [user?.signedAvatarExpiration, refreshSignedAvatarUrl])

  const setUserAndStore = (userData: UserData | null) => {
    setUser(userData)
    if (userData) localStorage.setItem('userData', JSON.stringify(userData))
    else localStorage.removeItem('userData')
  }

  const value = useMemo(
    () => ({
      user,
      setUser: setUserAndStore,
      refreshSignedAvatarUrl,
    }),
    [user, refreshSignedAvatarUrl]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
