// app/api/someResource/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const irDateInfo = { info: "Interest Rate Date Info" };
  return new NextResponse(JSON.stringify({ irDateInfo }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { guess } = await request.json();
    if (typeof guess !== "number") {
      throw new Error("Guess must be a number");
    }
    return new NextResponse(`You guessed ${guess}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error: unknown) {
    // We need to check if the error is an instance of Error
    if (error instanceof Error) {
      return new NextResponse(error.message, {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } else {
      // If it's not an Error, we handle it generically
      return new NextResponse('An unexpected error occurred', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  }
}