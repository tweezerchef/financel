'use client'

import { Avatar, Table, Group, Text } from '@mantine/core'
// import {
//   IconPencil,
//   IconMessages,
//   IconNote,
//   IconReportAnalytics,
//   IconTrash,
//   IconDots,
// } from '@tabler/icons-react'
import { useLeaderboard } from '../lib/useLeaderBoard'

export function LeaderBoard() {
  const { data } = useLeaderboard()
  const rows = data?.topEntries.map((player) => (
    <Table.Tr key={player.rank}>
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
    <Table verticalSpacing="md">
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
