import prisma from '../prisma/prisma'

export async function getUserById(id: string, type: 'guest' | 'registered') {
  if (type === 'guest')
    return prisma.guest.findUnique({
      where: { id },
    })

  return prisma.user.findUnique({
    where: { id },
  })
}

export async function getUserResults(id: string, type: 'guest' | 'registered') {
  const whereClause = type === 'guest' ? { guestId: id } : { userId: id }
  return prisma.result.findMany({
    where: whereClause,
    include: {
      categories: true,
    },
  })
}
