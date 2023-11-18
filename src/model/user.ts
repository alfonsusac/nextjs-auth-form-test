import { emailVerificationExpiryDate } from "@/api/authentication"
import { ClientError, DeveloperError, handleUniqueConstraintError, isPrismaUniqueConstraintError } from "@/lib/error"
import prisma from "@/lib/singleton"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { cache } from "react"


export namespace User {

  /**
   * Creates User
   * --------------------------------------------
   */
  export const create = cache(async <Provider extends "password" | "magiclink">({ username, email, provider, password }: {
    username: string,
    email: string,
    provider: Provider
    password: Provider extends "password" ? string : undefined
  }
  ) => {
    try {
      if (provider === 'magiclink')
        return await prisma.user.create({ data: { username, email, provider } })
      if (provider === "password")
        return await prisma.user.create({ data: { username, email, provider, password: { create: { value: password as any } } } })

    } catch (error: any) {
      handleUniqueConstraintError(error, "email", "Email is already taken")
      handleUniqueConstraintError(error, "username", "Username is already taken")
      throw error
    }
  })

  /**
   * Finds User
   * --------------------------------------------
   */
  export const findUsername = cache(async (
    username: string
  ) => {
    return await prisma.user.findUnique({ where: { username }, include: { verification: {} } })
  })
  console.log("Finding username by email...")
  export const findEmail = cache(async (
    email: string
  ) => {
    return await prisma.user.findUnique({ where: { email }, include: { verification: {} } })
  })

  // Used in:
  // - delete account
  export const remove = cache(async (
    username: string, email: string //email and username has to match
  ) => {

    try {
      await prisma.userPassword.delete({ where: { username } })
    } catch (error) { }

    try {
      await prisma.userVerification.delete({ where: { username } })
    } catch (error) { }

    return await prisma.user.delete({ where: { username, email } })

  })
}

export namespace Password {
  // Used in:
  // - login
  export const find = cache(async (
    username: string
  ) => {
    return await prisma.userPassword.findUnique({ where: { username }, include: { user: { include: { verification: {} } } } })
  })

  export const update = cache(async (
    username: string,
    oldPasswordHash: string,
    newPasswordHash: string
  ) => {
    return await prisma.userPassword.update({
      where: {
        username,
        value: oldPasswordHash
      },
      data: {
        value: newPasswordHash
      }
    })
  })

  export const forceUpdate = cache(async(
    username: string,
    newPasswordHash: string
  ) => {
    return await prisma.userPassword.update({
      where: { username },
      data: {
        value: newPasswordHash
      }
    })
  }) 
}

export namespace UserVerification {

  export const verifyKey = cache(async (
    id: string
  ) => {
    console.log("Verify User verifiation via Email")
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
    console.log("Creating User Verification Key in Database...")
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
