'use client'

import Image from 'next/image'
import { useLeaderboard } from '../lib/useLeaderBoard'

export function Leaderboard() {
  const { data, loading, error } = useLeaderboard()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading leaderboard</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <div>
        <h2>Top Players ({data.totalParticipants} total)</h2>
        {data.topEntries.map((player) => (
          <div
            key={`${player.rank}-${player.username}`}
            className="flex items-center gap-3 py-2"
          >
            <span className="w-6 text-right">{player.rank}.</span>
            {player.avatar ? (
              <Image
                src={player.avatar}
                alt={player.username}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
            <span>{player.username}</span>
            <span className="ml-auto">
              {typeof player.score === 'number'
                ? Math.round(player.score).toLocaleString()
                : '0'}
            </span>
          </div>
        ))}
      </div>

      {data.surroundingEntries.length > 0 && (
        <div>
          <h2>Your Position</h2>
          {data.surroundingEntries.map((player) => (
            <div
              key={`${player.rank}-${player.username}`}
              className="flex items-center gap-3 py-2"
            >
              <span className="w-6 text-right">{player.rank}.</span>
              {player.avatar ? (
                <Image
                  src={player.avatar}
                  alt={player.username}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200" />
              )}
              <span>{player.username}</span>
              <span className="ml-auto">
                {typeof player.score === 'number'
                  ? Math.round(player.score).toLocaleString()
                  : '0'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
