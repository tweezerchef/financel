import { createDailyChallenge } from './createDailyChallenge'

export async function runDailyChallenge() {
  console.log('Starting daily challenge creation...')
  try {
    const result = await createDailyChallenge()
    console.log('Daily challenge creation completed.')
    if (result?.length)
      console.log(
        'Challenges created:',
        result.map((r) => r?.id || 'unknown')
      )
    else console.log('No challenges were created.')
    return result
  } catch (error) {
    console.error('Error creating daily challenge:', error)
    throw error
  }
}

// Add this line to execute the function when the script is run
runDailyChallenge()
