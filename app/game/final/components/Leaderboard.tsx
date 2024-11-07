'use client'

import { Avatar, Table, Group, Text, Stack } from '@mantine/core'
import { v4 as uuidv4 } from 'uuid'
import { useLeaderboard } from '../lib/useLeaderBoard'
import classes from './ui/LeaderBoard.module.css'

interface LeaderboardEntry {
  rank: number
  score: number
  avatar: string | null
  username: string
  isCurrentPlayer?: boolean
}

interface Player {
  isCurrentPlayer: boolean
  rank: number
  score: number
  avatar: string
  username: string
}

const PlayerRow = ({
  player,
  className = '',
}: {
  player: Player
  className?: string
}) => (
  <Table.Tr
    className={
      player.isCurrentPlayer
        ? `${classes.currentPlayer} ${className}`
        : className
    }
  >
    <Table.Td>
      <Group
        gap="sm"
        justify="flex-start"
        wrap="nowrap"
        style={{ maxWidth: '300px', margin: '0 auto' }}
      >
        <Text fz="sm" fw={500} style={{ width: '30px' }}>
          {player.rank}.
        </Text>
        <Text fz="sm" style={{ width: '60px' }}>
          {player.score}
        </Text>
        <Avatar size={32} src={player.avatar} radius={32} />
        <Text
          fz="sm"
          fw={player.isCurrentPlayer ? 700 : 500}
          style={{ flex: 1 }}
        >
          {player.username}
        </Text>
      </Group>
    </Table.Td>
  </Table.Tr>
)

export function LeaderBoard() {
  const { data } = useLeaderboard()

  const toprows = data?.topEntries.map((entry: LeaderboardEntry) => (
    <PlayerRow
      key={uuidv4()}
      player={{
        rank: entry.rank,
        score: entry.score,
        username: entry.username,
        avatar: entry.avatar ?? '',
        isCurrentPlayer: Boolean(entry.isCurrentPlayer),
      }}
    />
  ))

  const surroundingrows = data?.surroundingEntries.map(
    (entry: LeaderboardEntry) => (
      <PlayerRow
        key={uuidv4()}
        player={{
          rank: entry.rank,
          score: entry.score,
          username: entry.username,
          avatar: entry.avatar ?? '',
          isCurrentPlayer: Boolean(entry.isCurrentPlayer),
        }}
      />
    )
  )

  return (
    <Stack className={classes.stack}>
      <Text fz="xl" fw={500} align="center" className={classes.topSectionTitle}>
        Today&apos;s Leaderboard
      </Text>
      <div className={classes.tableWrapper}>
        <Table verticalSpacing="xs" className={classes.table}>
          <Table.Tbody>{toprows}</Table.Tbody>
        </Table>
        <Text fz="xl" fw={500} align="center" className={classes.sectionTitle}>
          Your Position
        </Text>
        <Table verticalSpacing="xs" className={classes.table}>
          <Table.Tbody>{surroundingrows}</Table.Tbody>
        </Table>
      </div>
    </Stack>
  )
}
