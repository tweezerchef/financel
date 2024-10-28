'use client'

// import { Center } from '@mantine/core'

import { Stack } from '@mantine/core'
import { ScoreChart } from './components/ScoreChart'
import { LeaderBoard } from './components/LeaderBoard'
import classes from './ui/Page.module.css'

export default function Final() {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Stack style={{ flex: 1, minHeight: 0 }}>
          <ScoreChart />
          <LeaderBoard />
        </Stack>
      </div>
    </div>
  )
}
