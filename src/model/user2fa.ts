import { Cryptography } from "@/lib/crypto"
import prisma from "@/lib/singleton"
import { cache } from "react"

export namespace User2FA {
  export const find = cache(
    async function ({ username }: { username: string }) {
      const entry = await prisma.user2FA.findUnique({
        where: { username }
      })
      if(!entry) return null
      return await Cryptography.decrypt(entry.secret)
    }
  )
  export async function set(input: {
    username: string,
    twofasecret: string,
  }) {
    await prisma.user2FA.create({
      data: {
        username: input.username,
        secret: await Cryptography.encrypt(input.twofasecret),
      }
    })
  }
  export async function remove({ username }: {
    username: string
  }) {
    await prisma.user2FA.delete({
      where: { username }
    })
  }
}