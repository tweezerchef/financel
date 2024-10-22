import prisma from '../prisma/prisma'

export const findUserAuth = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
    },
  })
  return user
}
