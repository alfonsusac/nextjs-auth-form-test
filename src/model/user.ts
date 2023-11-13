import { emailVerificationExpiryDate } from "@/api/authentication"
import prisma from "@/lib/singleton"
import { cache } from "react"

export namespace User {

  // Used in:
  // - register user
  export const create = cache(async ({username, email, provider, password}:{
    username: string,
    email: string,
    provider: "password" | "magiclink"
    password?: string
  }
  ) => {
    if (provider === "password") {
      if (!password)
        throw new Error("Password needs to be provide if using password provider")

      return await prisma.user.create({ data: { username, email, provider, password: {create:{value: password}} } })
    } else {
      return await prisma.user.create({ data: { username, email, provider } })
    }
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

export namespace Password{
  // Used in:
  // - login
  export const find = cache(async (
    username: string
  ) => {
    return await prisma.userPassword.findUnique({ where: { username }, include: { user: { include: {verification: {}}} } })
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
    }).catch(error => {
      console.log("Error upserting user verification")
      console.log(error)
    })
  })
}