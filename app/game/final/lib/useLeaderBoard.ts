import { LeaderboardCategory } from '@prisma/client'
import { useState, useEffect } from 'react'

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
  category: LeaderboardCategory = 'FINAL'
): Promise<LeaderboardData> {
  // Convert category to lowercase for the URL
  const categoryPath = category.toLowerCase()
  const response = await fetch(`/api/leaderboard/today/${categoryPath}`)
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

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        const leaderboardData = await fetchLeaderboard() // Debug log
        setData(leaderboardData)
      } catch (err) {
        console.error('Error loading leaderboard:', err) // Debug log
        setError(
          err instanceof Error ? err : new Error('Failed to fetch leaderboard')
        )
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()

    // Refresh every 30 seconds
  }, [])

  return { data, error, loading }
}
