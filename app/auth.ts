import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { authConfig } from './auth.config'
import { findUserAuth } from './lib/auth/findUserAuth'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials
        if (typeof email === 'string' && typeof password === 'string') {
          const user = await findUserAuth(email)
          if (!user) return null
          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
        }
        console.warn('Invalid credentials')
        return null
      },
    }),
  ],
})
