'use client'

import { createContext, useContext, useMemo, useState, ReactNode } from 'react'

type UserType = 'guest' | 'registered'

interface UserData {
  id: string
  type: UserType
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

  const value = useMemo(() => ({ user, setUser }), [user, setUser])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
