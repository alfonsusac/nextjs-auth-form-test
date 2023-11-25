import { emailVerificationExpiryDate } from "@/api/authentication"
import prisma from "@/lib/singleton"
import { cache } from "react"
import { PrismaUtil } from "."
import { Password } from "./password"
import { UserVerification } from "./verification"

type UserProvider = "password" | "magiclink"
type IsUsingPassword<Provider extends UserProvider> = Provider extends "password" ? string : undefined

export namespace User {

  export const create = cache(
    async function <Provider extends UserProvider>({ username, email, provider, password }: {
      username: string,
      email: string,
      provider: Provider
      password: IsUsingPassword<Provider>
    }) {
      try {
        if (provider === 'magiclink') return await prisma.user.create({ data: { username, email, provider } })
        if (provider === "password") return await prisma.user.create({ data: { username, email, provider, password: { create: { value: password as any } } } })
      }
      catch (error: any) {
        PrismaUtil.throwIfConstraintError(error, "email", "Email")
        PrismaUtil.throwIfConstraintError(error, "username", "Username")
        throw error
      }
    }
  )

  export const findUsername = cache(
    async function (username: string) {
      return await prisma.user.findUnique({
        where: { username },
        include: { verification: {} }
      })
    })

  export const findEmail = cache(
    async function (email: string) {
      return await prisma.user.findUnique({
        where: { email },
        include: { verification: {} }
      })
    })

  export const remove = cache(
    async function (username: string, email: string) {
      try { await Password.forceDelete(username) } catch { }
      try { await UserVerification.forceDelete(username) } catch { }
      return await prisma.user.delete({ where: { username, email } })
    })

  export const updateUsername = cache(
    async function (username: string, email: string, newUsername: string) {
      try {
        await prisma.user.update({
          where: {
            email, username
          },
          data: {
            username: newUsername,
          }
        })
      } catch (error) {
        PrismaUtil.throwIfConstraintError(error, "username", "Username")
        throw error
      }
    }
  )

  export const changeEmail = cache(
    async function (username: string, email: string, newEmail: string) {
      try {
        await prisma.user.update({
          where: {
            email, username
          },
          data: {
            email: newEmail
          }
        })
      } catch (error) {
        PrismaUtil.throwIfConstraintError(error, "email", "Email")
        throw error
      }
    }
  )

}



