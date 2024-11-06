import type { Metadata } from 'next'
import LocalFont from 'next/font/local'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import {
  Center,
  MantineProvider,
  createTheme,
  MantineColorsTuple,
} from '@mantine/core'
import './ui/global.css'
import '@mantine/core/styles.css'
import classes from './ui/Layout.module.css'
import '@mantine/carousel/styles.css'

import { DailyChallengeInitializer } from './lib/DailyChallengeInitializer'
import { UserProvider } from './context/user/UserContext'
import { DailyChallengeProvider } from './context/dailyChallenge/DailyChallengeContext'

const myColor: MantineColorsTuple = [
  '#e0fbff',
  '#cbf2ff',
  '#9ae2ff',
  '#64d2ff',
  '#3cc5fe',
  '#23bcfe',
  '#09b8ff',
  '#00a1e4',
  '#0090cd',
  '#007cb5',
]
const yellow: MantineColorsTuple = [
  '#fffee1',
  '#fffccb',
  '#fff99a',
  '#fff564',
  '#fff238',
  '#fff11d',
  '#fff009',
  '#e3d500',
  '#c9bd00',
  '#ada300',
]

const tickerFont = LocalFont({
  src: './SUBWT___.ttf',
  display: 'swap',
  variable: '--font-ticker',
  preload: true,
  fallback: ['monospace'],
})
const wsjBoldInitial = LocalFont({
  src: './WSBI___.ttf',
  display: 'swap',
  variable: '--font-wsj',
  preload: true,
  fallback: ['serif'],
})

const theme = createTheme({
  colors: {
    myColor,
    yellow,
  },
  primaryColor: 'myColor',
  primaryShade: 6,
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
  },
  title: 'Financle',
  description: 'A game for the Brothers and Sisters of Finance',
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
      <head />
      <body className={classes.body}>
        <main>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <div className={classes.rootContainer}>
              <UserProvider>
                <DailyChallengeProvider>
                  <DailyChallengeInitializer>
                    <Center>{children}</Center>
                  </DailyChallengeInitializer>
                </DailyChallengeProvider>
              </UserProvider>
            </div>
          </MantineProvider>
        </main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
