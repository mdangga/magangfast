import { PrismaClient } from '@prisma/client'

// Patch BigInt so JSON.stringify doesn't fail on Prisma BigInt IDs
declare global {
  interface BigInt {
    toJSON(): number
  }
}

BigInt.prototype.toJSON = function () {
  return Number(this)
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

