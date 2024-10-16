import prisma from '../prisma/prisma'
import { createDailyChallenge } from './createDailyChallenge'

async function testCreateDailyChallenge() {
  try {
    console.log('Creating a test daily challenge...')
    const challenge = await createDailyChallenge()

    console.log('Challenge created:')
    console.log(JSON.stringify(challenge, null, 2))

    // Optionally, you can fetch and display more details:
    if (!challenge) {
      console.error('No challenge created')
      return
    }
    const fullChallenge = await prisma.dailyChallenge.findUnique({
      where: { id: challenge.id },
      include: {
        date: true,
        interestRate: {
          include: {
            rateType: true,
          },
        },
      },
    })

    console.log('Full challenge details:')
    console.log(JSON.stringify(fullChallenge, null, 2))
  } catch (error) {
    console.error('Error creating test challenge:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCreateDailyChallenge()
