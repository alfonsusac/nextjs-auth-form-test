import prisma from "@/lib/singleton"
import { cache } from "react"
import { PrismaUtil } from "."
import { UserPassword } from "./password"
import { UserVerification } from "./verification"
import { User2FA } from "./user2fa"

type UserProvider = "password" | "magiclink"
type IsUsingPassword<Provider extends UserProvider> = Provider extends "password" ? string : undefined

export namespace User {

  export const create = cache(
    async function <Provider extends UserProvider>({ username, email, provider, hashedPassword: password }: {
      username: string,
      email: string,
      provider: Provider
      hashedPassword: IsUsingPassword<Provider>
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
    async function ({ username, email }: {username: string, email: string}) {
      try { await UserPassword.forceDelete(username) } catch { }
      try { await UserVerification.forceDelete(username) } catch { }
      try { await User2FA.remove({ username }) } catch { }
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

  export const updateEmail = cache(
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



