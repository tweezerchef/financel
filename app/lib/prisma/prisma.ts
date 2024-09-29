/* eslint-disable no-use-before-define */
/* eslint-disable vars-on-top */
import { PrismaClient, Prisma } from '@prisma/client'
import { withOptimize } from '@prisma/extension-optimize'

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  if (!process.env.OPTIMIZE_API_KEY)
    throw new Error('OPTIMIZE_API_KEY environment variable is not set')

  const logQuery = (e: Prisma.QueryEvent) => {
    console.log(`Query: ${e.query}`)
    console.log(`Params: ${e.params}`)
    console.log(`Duration: ${e.duration}ms`)
  }

  const prismaClientOptions: Prisma.PrismaClientOptions = {
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'error' },
            { emit: 'stdout', level: 'info' },
            { emit: 'stdout', level: 'warn' },
          ]
        : undefined,
  }

  const baseClient = new PrismaClient(prismaClientOptions)

  if (process.env.NODE_ENV === 'development')
    baseClient.$on('query' as never, logQuery)

  const prisma = baseClient.$extends(
    withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
  )

  return prisma
}

const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
