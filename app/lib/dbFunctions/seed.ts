/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { PrismaClient, Rank } from '@prisma/client'
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const avatarUrls = [
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/astronaut.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/avatar-36801134.svg',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/bear.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/cat.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/cool-.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/evil-2162179.svg',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/favicon.png',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/favicon.svg',
  'https://financle.s3.us-east-2.amazonaws.com/app/avatars/girl.png',
]

const ranks: Rank[] = ['WOOD', 'COPPER', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM']

async function seed() {
  try {
    // Check for existing seeded users
    const existingSeededUsers = await prisma.user.count({
      where: { emailToken: 'SEED_USER' },
    })

    if (existingSeededUsers > 0) {
      console.log(
        `Found ${existingSeededUsers} existing seeded users. Skipping seed.`
      )
      return
    }

    const users = []

    for (let i = 0; i < 20; i++) {
      const password = faker.internet.password()
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.username(),
          password: hashedPassword,
          avatarUrl: avatarUrls[Math.floor(Math.random() * avatarUrls.length)],
          moto: faker.lorem.sentence(),
          rank: ranks[Math.floor(Math.random() * ranks.length)],
          createdAt: faker.date.past(),
          updatedAt: new Date(),
          lastLogin: faker.date.recent(),
          lastPlay: faker.date.recent(),
          isActive: true,
          emailToken: 'SEED_USER', // Mark as seeded user
        },
      })

      users.push(user)
    }

    console.log('Seeded 20 new users successfully')
  } catch (error) {
    console.error('Error seeding users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
