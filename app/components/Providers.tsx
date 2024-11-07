'use client'

import { MantineProvider } from '@mantine/core'
import { UserProvider } from '../context/user/UserContext'
import { DailyChallengeProvider } from '../context/dailyChallenge/DailyChallengeContext'
import { DailyChallengeInitializer } from '../lib/DailyChallengeInitializer'
import { ScoreProvider } from '../context/user/ScoreContext'
import { theme } from '../theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <DailyChallengeProvider>
        <DailyChallengeInitializer>
          <ScoreProvider>
            <MantineProvider theme={theme} defaultColorScheme="light">
              {children}
            </MantineProvider>
          </ScoreProvider>
        </DailyChallengeInitializer>
      </DailyChallengeProvider>
    </UserProvider>
  )
}
