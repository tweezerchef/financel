'use client'

import { SessionProvider } from 'next-auth/react'
import { MantineProvider, MantineThemeOverride } from '@mantine/core'
import { UserProvider } from '../context/user/UserContext'
import { DailyChallengeProvider } from '../context/dailyChallenge/DailyChallengeContext'

interface ProvidersProps {
  children: React.ReactNode
  theme: MantineThemeOverride
}

export function Providers({ children, theme }: ProvidersProps) {
  return (
    <SessionProvider>
      <MantineProvider theme={theme}>
        <UserProvider>
          <DailyChallengeProvider>{children}</DailyChallengeProvider>
        </UserProvider>
      </MantineProvider>
    </SessionProvider>
  )
}
