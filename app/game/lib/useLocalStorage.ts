'use client'

import { useState, useEffect } from 'react'

export function useLocalStorage(
  key: string,
  initialValue: string | null = null
) {
  const [value, setValue] = useState<string | null>(initialValue)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log(`useLocalStorage effect for key: ${key}`)
    const storedValue = localStorage.getItem(key)
    console.log(`Retrieved value for ${key}:`, storedValue)
    setValue(storedValue)
    setIsLoading(false)
  }, [key])

  const setStoredValue = (newValue: string | null) => {
    console.log(`Setting value for ${key}:`, newValue)
    setValue(newValue)
    if (newValue === null) localStorage.removeItem(key)
    else localStorage.setItem(key, newValue)
  }

  return [value, setStoredValue, isLoading] as const
}
