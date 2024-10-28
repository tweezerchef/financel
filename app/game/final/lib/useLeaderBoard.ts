'use client'

import { LeaderboardCategory } from '@prisma/client'
import { useState, useEffect } from 'react'
import { useUserContext } from '../../../context/user/UserContext'

interface LeaderboardEntry {
  rank: number
  score: number
  username: string
  avatar: string | null
  isGuest: boolean
}

interface LeaderboardData {
  totalParticipants: number
  topEntries: LeaderboardEntry[]
  surroundingEntries: LeaderboardEntry[]
  lastCalculated: string
}

export async function fetchLeaderboard(
  resultId?: string,
  category: LeaderboardCategory = 'FINAL'
): Promise<LeaderboardData> {
  const categoryPath = category.toLowerCase()
  // Add resultId to URL if it exists
  const url = resultId
    ? `/api/leaderboard/today/${categoryPath}?resultId=${resultId}`
    : `/api/leaderboard/today/${categoryPath}`
  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 404)
      return {
        totalParticipants: 0,
        topEntries: [],
        surroundingEntries: [],
        lastCalculated: new Date().toISOString(),
      }

    throw new Error('Failed to fetch leaderboard')
  }
  const data = await response.json()

  return data
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useLeaderboard(category: LeaderboardCategory = 'FINAL') {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useUserContext()

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        const leaderboardData = await fetchLeaderboard(user?.resultId, category)
        setData(leaderboardData)
      } catch (err) {
        console.error('Error loading leaderboard:', err)
        setError(
          err instanceof Error ? err : new Error('Failed to fetch leaderboard')
        )
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [category, user?.resultId]) // Add user?.resultId to dependencies

  return { data, error, loading }
}
