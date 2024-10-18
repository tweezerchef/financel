import NextAuth, { NextAuthOptions, Session, User } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcrypt'
import { prisma } from '../../../lib/prisma/prisma' // Adjust the import path as needed

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isPasswordValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.username,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) return { ...token, id: user.id }

      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    // ... other custom pages
  },
}

const isDefaultSigninPage = (req: NextApiRequest): boolean =>
  req.method === 'GET' && (req.query.nextauth as string[])?.includes('signin')

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Remove GoogleProvider for the default signin page
  if (isDefaultSigninPage(req))
    authOptions.providers = authOptions.providers.filter(
      (p) => p.id !== 'google'
    )

  // Handle guest authentication
  if ((req.query.nextauth as string[])?.includes('guest')) {
    const ip = (
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      ''
    )
      .split(',')[0]
      .trim()
    let guest = await prisma.guest.findUnique({ where: { ip } })

    if (!guest) guest = await prisma.guest.create({ data: { ip } })

    const session = await prisma.session.create({
      data: {
        guestId: guest.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sessionToken:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
      },
    })

    res.json({ sessionToken: session.sessionToken })
    return
  }

  return NextAuth(req, res, authOptions)
}
