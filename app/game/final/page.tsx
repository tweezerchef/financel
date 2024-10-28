'use client'

import { ScoreChart } from './components/ScoreChart'
import { LeaderBoard } from './components/LeaderBoard'
import classes from './ui/Page.module.css'

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
