import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Center, ColorSchemeScript, MantineProvider } from '@mantine/core'
import './ui/global.css'
import '@mantine/core/styles.css'
import classes from './ui/Layout.module.css'

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
          <MantineProvider>
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
