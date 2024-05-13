import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Center, ColorSchemeScript, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import styles from './ui/Layout.module.css'

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
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <main>
          <MantineProvider>
            <div className={styles.rootContainer}>
              <Center>{children}</Center>
            </div>
          </MantineProvider>
        </main>
        <SpeedInsights />
      </body>
    </html>
  )
}
