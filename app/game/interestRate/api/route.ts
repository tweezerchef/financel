import { NextRequest, NextResponse } from 'next/server'
import { arrowDecider } from '../../../lib/interestRate/arrowDecider'
import prisma from '../../../lib/prisma/prisma'

export const config = {
  runtime: 'edge',
}

const getSecondsUntilMidnight = () => {
  const now = new Date()
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  )
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

export async function GET() {
  const irDateInfo = { info: 'Interest Rate Date Info' }
  return new NextResponse(JSON.stringify({ irDateInfo }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const today = new Date()
    const dateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
    const { guess } = await request.json()
    console.log(guess)
    if (typeof guess !== 'number') throw new Error('Guess must be a number')

    const cacheKey = `dailyChallenge-${dateOnly.toISOString().split('T')[0]}`
    const cache = await caches.open('daily-challenge-cache')
    const cachedData = await cache.match(cacheKey)

    let dailyChallenge
    if (cachedData) dailyChallenge = await cachedData.json()
    else
      dailyChallenge = await prisma.dailyChallenge.findUnique({
        where: { challengeDate: dateOnly },
        include: {
          interestRate: {
            select: {
              rate: true,
            },
          },
        },
      })

    if (!dailyChallenge) throw new Error('Invalid daily challenge')
    const cacheResponse = new Response(JSON.stringify(dailyChallenge))
    const secondsUntilMidnight = getSecondsUntilMidnight()
    cacheResponse.headers.set(
      'Cache-Control',
      `max-age=${secondsUntilMidnight}`
    )
    await cache.put(cacheKey, cacheResponse)
    const { rate } = dailyChallenge.interestRate
    const rateNumber = rate.toNumber()
    const result = arrowDecider(guess, rateNumber)
    console.log('result', result, 'rate', rateNumber)

    return new Response(
      JSON.stringify({ direction: result.direction, amount: result.amount }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: unknown) {
    if (error instanceof Error)
      // Return error response
      return new NextResponse(error.message, {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
        },
      })

    // Return generic error response
    return new NextResponse('An unexpected error occurred', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}
