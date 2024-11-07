import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          {/* Replace Next.js Image with a regular img element */}
          <img
            src="https://financle.app/favicon.svg"
            alt="Financle Logo"
            width="120"
            height="120"
            style={{
              objectFit: 'contain',
            }}
          />
          <h1
            style={{
              fontSize: '6rem',
              color: '#ffffff',
              lineHeight: 1.2,
              textAlign: 'center',
            }}
          >
            Financle
          </h1>
          <p
            style={{
              fontSize: '2.5rem',
              color: '#888888',
              textAlign: 'center',
            }}
          >
            A game for the Brothers and Sisters of Finance
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
