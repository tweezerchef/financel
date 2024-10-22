import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnGame = nextUrl.pathname.startsWith('/game')
      if (isOnGame) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      if (isLoggedIn) return Response.redirect(new URL('/game', nextUrl))

      return true
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
