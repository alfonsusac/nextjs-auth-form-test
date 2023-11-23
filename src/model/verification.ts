import prisma from "@/lib/singleton"
import { cache } from "react"

export namespace DB {
  export namespace VerificationToken {

    export const create =
      cache(
        async (data: {
          purpose: string,
          expiryDurationMilisecond: number,
        }) => {
          console.log("Creating Verification Token")
          return await prisma.verificationToken.create({
            data: {
              purpose: data.purpose,
              expiry: new Date(Date.now() + data.expiryDurationMilisecond)
            }
          })
        }
      )

    export const verify =
      cache(
        async (where: {
          id: string,
        }) => {
          return await prisma.verificationToken.delete({ where })
        }
      )
  }

}


