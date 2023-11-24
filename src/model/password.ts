import prisma from "@/lib/singleton"
import { cache } from "react"

export namespace Password {

  export const find = cache(async (
    username: string
  ) => {
    return await prisma.userPassword.findUnique({
      where: { username },
      include: { user: { include: { verification: {} } } }
    })
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
      data: { value: newPasswordHash }
    })
  })


  export const forceUpdate = cache(async ({ username, newPasswordHash }: {
    username: string,
    newPasswordHash: string
  }
  ) => {
    return await prisma.userPassword.update({
      where: { username }, data: { value: newPasswordHash }
    })
  })

  export const forceDelete = cache(
    async function (username: string) {
      return await prisma.userPassword.delete({ where: { username } })
    }
  )


}