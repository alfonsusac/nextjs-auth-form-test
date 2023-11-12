import { emailVerificationExpiryDate } from "@/api/authentication"
import prisma from "@/lib/singleton"
import { cache } from "react"

export namespace User {

  // Used in:
  // - register user
  export const create = cache(async (
    username: string,
    email: string,
    password: string
  ) => {
    return await prisma.user.create({ data: { username, email, password } })
  })

  // Used in:
  // - login
  export const find = cache(async (
    username: string
  ) => {
    return await prisma.user.findUnique({ where: { username }, include: { verification: {} } })
  })

  // Used in:
  // - delete account
  export const remove = cache(async (
    username: string, email: string //email and username has to match
  ) => {
    await prisma.userVerification.delete({ where: { username } })
    return await prisma.user.delete({ where: { username, email } })
  })
}

export namespace UserVerification {

  export const verifyKey = cache(async (
    id: string
  ) => {
    return await prisma.userVerification.update({
      where: {
        id,
        verified: false,
        expiry: { gt: new Date(Date.now()) }
      },
      data: {
        verified: true,
      }
    })
  })

  export const setKey = cache(async (
    username: string
  ) => {
    return await prisma.userVerification.upsert({
      where: {
        username,
        verified: false
      },
      create: {
        username,
        expiry: emailVerificationExpiryDate()
      },
      update: {
        expiry: emailVerificationExpiryDate()
      }
    })
  })
}