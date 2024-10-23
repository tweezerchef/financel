import { createDailyChallenge } from './createDailyChallenge'

export async function runDailyChallenge() {
  console.log('Starting daily challenge creation...')
  try {
    const result = await createDailyChallenge()
    console.log('Daily challenge creation completed.')
    if (result) console.log('Challenge created:', result.id)
    else console.log('No challenge was created.')
    return result
  } catch (error) {
    console.error('Error creating daily challenge:', error)
    throw error
  }
}

// Add this line to execute the function when the script is run
runDailyChallenge()
