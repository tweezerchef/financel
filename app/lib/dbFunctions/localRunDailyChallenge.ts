import { runDailyChallenge } from './runDailyChallenge'

runDailyChallenge()
  .catch(console.error)
  .finally(() => process.exit(0))
