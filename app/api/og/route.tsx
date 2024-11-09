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
          padding: '0',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '-175px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '0rem',
              position: 'relative',
              left: '75px',
            }}
          >
            <h1
              style={{
                fontSize: '8rem',
                color: 'transparent',
                lineHeight: 0.9,
                margin: 0,
                marginBottom: '-22px',
                background: 'linear-gradient(90deg, #fff564 0%, #ffeb00 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              Financle
            </h1>
            <img
              src="https://financle.app/favicon.svg"
              alt="Financle Logo"
              width="450"
              height="450"
              style={{
                objectFit: 'contain',
                display: 'block',
                marginBottom: '-150px',
              }}
            />
          </div>
          <p
            style={{
              fontSize: '2.5rem',
              color: '#888888',
              margin: 0,
              padding: 0,
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
