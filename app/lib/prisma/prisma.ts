/* eslint-disable no-use-before-define */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
// prisma.ts
import { PrismaClient } from '@prisma/client'
import { withOptimize } from '@prisma/extension-optimize'

declare global {
  var prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  if (!process.env.OPTIMIZE_API_KEY)
    throw new Error('OPTIMIZE_API_KEY environment variable is not set')

  return new PrismaClient().$extends(
    withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
  )
}

const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
