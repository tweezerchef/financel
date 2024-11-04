'use client'

import { Avatar, Table, Group, Text, Stack } from '@mantine/core'
import { useLeaderboard } from '../lib/useLeaderBoard'
import classes from './ui/LeaderBoard.module.css'

export function LeaderBoard() {
  const { data } = useLeaderboard()

  const toprows = data?.topEntries.map((player) => (
    <Table.Tr key={player.username}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
            {player.rank}.
          </Text>
          <Text fz="sm">{player.score}</Text>
          <Avatar size={40} src={player.avatar} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {player.username}
            </Text>
          </div>
        </Group>
      </Table.Td>
    </Table.Tr>
  ))

  const surroundingrows = data?.surroundingEntries.map((player) => (
    <Table.Tr key={player.username}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
            {player.rank}.
          </Text>
          <Text fz="sm">{player.score}</Text>
          <Avatar size={40} src={player.avatar} radius={40} />
          <div>
            <Text fz="sm" fw={500}>
              {player.username}
            </Text>
          </div>
        </Group>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Stack className={classes.stack}>
      <Text fz="md" fw={500} align="center">
        Leaderboard
      </Text>
      <div className={classes.tableWrapper}>
        <Table verticalSpacing="xs" className={classes.table}>
          <Table.Tbody>{toprows}</Table.Tbody>
        </Table>
        <Text fz="sm" fw={500} align="center">
          Surrounding Players
        </Text>
        <Table verticalSpacing="xs" className={classes.table}>
          <Table.Tbody>{surroundingrows}</Table.Tbody>
        </Table>
      </div>
    </Stack>
  )
}
