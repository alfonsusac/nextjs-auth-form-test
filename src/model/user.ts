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
    return await prisma.user.create({ data: { username, email, password }})
  })

  // Used in:
  // - login
  export const find = cache(async (
    username: string
  ) => {
    return await prisma.user.findUnique({ where: { username }})
  })

}