'use client'

import { useEffect, useState } from 'react'

export function useLocalStorage(key: string) {
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    const storedValue = localStorage.getItem(key)
    setValue(storedValue)
  }, [key])

  return value
}
