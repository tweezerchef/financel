'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage(
  key: string,
  initialValue: string | null = null
) {
  const [value, setValue] = useState<string | null>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedValue = localStorage.getItem(key)
    setValue(storedValue)
    setIsLoading(false)
  }, [key])

  const setStoredValue = (newValue: string | null) => {
    setValue(newValue)
    if (newValue === null) localStorage.removeItem(key)
    else localStorage.setItem(key, newValue)
  }

  return [value, setStoredValue, isLoading] as const
}
