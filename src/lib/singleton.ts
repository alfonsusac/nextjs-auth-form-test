import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  console.log("Creating New Prisma Client...")
  return new PrismaClient({
    errorFormat: 'pretty',
    log: ['info', 'warn', 'error', 'query']
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}