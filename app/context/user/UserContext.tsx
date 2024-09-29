'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from 'react'

type UserType = 'guest' | 'registered'

interface UserData {
  id: string
  type: UserType
  resultId: string
}

interface UserContextType {
  user: UserData | null
  setUser: (userData: UserData | null) => void
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

  useEffect(() => {
    // Load user data from localStorage on initial render
    const storedUser = localStorage.getItem('userData')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const setUserAndStore = (userData: UserData | null) => {
    setUser(userData)
    if (userData) localStorage.setItem('userData', JSON.stringify(userData))
    else localStorage.removeItem('userData')
  }

  const value = useMemo(() => ({ user, setUser: setUserAndStore }), [user])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
