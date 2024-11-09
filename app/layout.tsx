import type { Metadata } from 'next'
import LocalFont from 'next/font/local'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { Center } from '@mantine/core'
import { Providers } from './components/Providers'
import './ui/global.css'
import '@mantine/core/styles.css'
import classes from './ui/Layout.module.css'
import '@mantine/carousel/styles.css'

const tickerFont = LocalFont({
  src: './SUBWT___.ttf',
  display: 'swap',
  variable: '--font-ticker',
  preload: true,
  fallback: ['monospace'],
  adjustFontFallback: 'Arial',
})

const wsjBoldInitial = LocalFont({
  src: './WSBI___.ttf',
  display: 'swap',
  variable: '--font-wsj',
  preload: true,
  fallback: ['serif'],
  adjustFontFallback: 'Times New Roman',
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
  },
  title: 'Financle',
  description: 'A game for the Brothers and Sisters of Finance',
  metadataBase: new URL('https://financle.app'),
  openGraph: {
    title: 'Financle',
    description: 'A game for the Brothers and Sisters of Finance',
    url: 'https://financle.app',
    siteName: 'Financle',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://financle.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Financle - Finance Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financle',
    description: 'A game for the Brothers and Sisters of Finance',
    images: ['https://financle.app/og-image.png'],
  },
  keywords: [
    'finance game',
    'financial puzzle',
    'stock market game',
    'trading game',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
    nocache: false,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  verification: {
    google: 'wk8NThZ46IXJSg5Srtl8wGCRosOVAz9E4a5EIpzHElQ',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${classes.html} ${tickerFont.variable} ${wsjBoldInitial.variable}`}
    >
      <body className={classes.body}>
        <Providers>
          <div className={classes.rootContainer}>
            <Center>{children}</Center>
          </div>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
