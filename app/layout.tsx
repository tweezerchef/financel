import type { Metadata } from 'next'
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
    <html lang="en" className={classes.html}>
      <head>
        {(process.env.NODE_ENV === 'development' ||
          process.env.VERCEL_ENV === 'preview') && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            data-project-id="3PVf4jj5xWcUli4mwbcCXjsviq2spH6Ag09Qu5DR"
            data-is-production-environment="false"
            src="https://snippet.meticulous.ai/v1/meticulous.js"
          />
        )}
        <ColorSchemeScript />
      </head>
      <body className={classes.body}>
        <main>
          <MantineProvider theme={theme}>
            <div className={classes.rootContainer}>
              <Center>{children}</Center>
            </div>
          </MantineProvider>
        </main>
        <SpeedInsights />
      </body>
    </html>
  )
}
