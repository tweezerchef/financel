'use client'

import { useLeaderboard } from '../lib/useLeaderBoard'

export function Leaderboard() {
  const { data, loading, error } = useLeaderboard()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading leaderboard</div>
  if (!data) return null

  return (
    <div>
      <h2>Leaderboard ({data.totalParticipants} players)</h2>
      {data.entries.map((player) => (
        <div key={`${player.rank}-${player.username}`}>
          {player.rank}. {player.username} - {player.score}
        </div>
      ))}
    </div>
  )
}
