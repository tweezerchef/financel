import { calculateDailyLeaderboard } from '../../../../lib/dbFunctions/calculateDailyLeaderboard'

export async function POST() {
  try {
    await calculateDailyLeaderboard()
    return Response.json({ success: true })
  } catch (error) {
    console.error('Failed to calculate leaderboard:', error)
    return Response.json({ success: false }, { status: 500 })
  }
}
