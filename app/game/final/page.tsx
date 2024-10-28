'use client'

// import { Center } from '@mantine/core'

// import { Center, Stack } from '@mantine/core'
import { ScoreChart } from './components/ScoreChart'
import { LeaderBoard } from './components/LeaderBoard'
import classes from './ui/Page.module.css'
// import { FinalModel } from './components/FinalModel'

export default function Final() {
  return (
    <div className={classes.container}>
      <div className={classes.scoreChartWrapper}>
        <ScoreChart />
      </div>
      <div className={classes.leaderboardWrapper}>
        <LeaderBoard />
      </div>
    </div>
  )
}
