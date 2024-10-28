import { Center } from '@mantine/core'
import { ScoreChart } from './components/ScoreChart'
import { LeaderBoard } from './components/LeaderBoard'

export default function Final() {
  return (
    <div>
      <ScoreChart />
      <Center>
        <LeaderBoard />
      </Center>
    </div>
  )
}
