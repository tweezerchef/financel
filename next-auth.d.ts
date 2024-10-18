import 'next-auth'

import { User as PrismaUser } from '@prisma/client'

declare module 'next-auth' {
  interface User extends PrismaUser {}
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
    } & User
  }
}
