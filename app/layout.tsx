import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ColorSchemeScript, Center } from '@mantine/core'
import './ui/global.css'
import '@mantine/core/styles.css'
import classes from './ui/Layout.module.css'
import { DailyChallengeInitializer } from './lib/DailyChallengeInitializer'
import { Providers } from './components/Providers'
import { theme } from './ui/theme'

const tickerFont = localFont({
  src: './SUBWT___.ttf',
  display: 'swap',
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
  },
  title: 'Financel',
  description: 'A game for the Brothers of Finance',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${classes.html} ${tickerFont.className}`}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={classes.body}>
        <Providers theme={theme}>
          <main>
            <div className={classes.rootContainer}>
              <DailyChallengeInitializer>
                <Center>{children}</Center>
              </DailyChallengeInitializer>
            </div>
          </main>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
