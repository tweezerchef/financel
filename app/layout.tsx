/* eslint-disable react/jsx-no-duplicate-props */
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { SpeedInsights } from '@vercel/speed-insights/next'
import {
  Center,
  ColorSchemeScript,
  MantineProvider,
  createTheme,
  MantineColorsTuple,
} from '@mantine/core'
import './ui/global.css'
import '@mantine/core/styles.css'
import classes from './ui/Layout.module.css'
import { UserProvider } from './context/user/UserContext'

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

const tickerFont = localFont({
  src: './SUBWT___.ttf',
  display: 'swap',
})

const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: 'myColor',
  primaryShade: 6,
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
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
        <main>
          <MantineProvider theme={theme}>
            <div className={classes.rootContainer}>
              <UserProvider>
                <Center>{children}</Center>
              </UserProvider>
            </div>
          </MantineProvider>
        </main>
        <SpeedInsights />
      </body>
    </html>
  )
}
