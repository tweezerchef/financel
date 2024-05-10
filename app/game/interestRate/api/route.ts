import { NextRequest, NextResponse } from 'next/server'
import { arrowDecider } from '../../../lib/arrowDecider'



export async function GET(request: NextRequest) {
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
    const { guess, category } = await request.json();
    if (typeof guess !== 'number') throw new Error('Guess must be a number');
    // if (typeof category !== IRCategory (category)) {
    //   throw new Error('Invalid or missing category');
    // }
    //place holder this will be a placeholder for the actual rate.
    const actualRate = 1.53;

    const result = arrowDecider(guess, actualRate);

    return new NextResponse(JSON.stringify({
        guess: guess,
        actualRate: actualRate,
        direction: result.direction,
        amount: result.amount
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(error.message, {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
    return new NextResponse('An unexpected error occurred', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}