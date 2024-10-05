import prisma from '../prisma/prisma'

export async function updateUserAvatar(userId: string, avatarUrl: string) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    })
    return updatedUser
  } catch (error) {
    console.error('Error updating user avatar:', error)
    throw error
  }
}
