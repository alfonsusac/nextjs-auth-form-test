import { emailVerificationExpiryDate } from "@/api/authentication"
import prisma from "@/lib/singleton"
import { cache } from "react"

export namespace DB {
  export namespace VerificationToken {

    export const create = cache(
      async function (data: { purpose: string, expiryDurationMilisecond: number }) {
        console.log("Creating Verification Token")
        return await prisma.verificationToken.create({
          data: {
            purpose: data.purpose,
            expiry: new Date(Date.now() + data.expiryDurationMilisecond)
          }
        })
      }
    )

    export const verify = cache(
      async function (where: { id: string, }) {
        return await prisma.verificationToken.delete({ where })
      }
    )
  }

}



export namespace UserVerification {

  export const verifyKey = cache(async function (id: string) {
    return await prisma.userVerification.update({
      where: {
        id,
        verified: false,
        expiry: { gt: new Date(Date.now()) }
      },
      data: { verified: true }
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

  export const forceDelete = cache(
    async function (username: string) {
      return await prisma.userVerification.delete({ where: { username } })
    }
  )
}
