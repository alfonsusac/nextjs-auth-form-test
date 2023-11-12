import { Cryptography } from "@/lib/crypto"
import { JWT } from "@/lib/jwt"
import { User } from "@/model/user"
import { authCookie } from "./auth/actions"
import { cache } from "react"

export const secretKey = "super secret key"

/**
 * Logs users in.
 * - needs to be wrapped in try catch, User.find and Cryptography.veriy might fail.
 */
export async function login(username: string, password: string) {
  try {

    const user = await User.find(username)

    if (!user)
      return "User not found"
    if (!await Cryptography.verify(user.password, password))
      return "Wrong password"

    const jwt = await JWT.create({
      payload: {
        username: user.username,
        email: user.email
      },
      secret: secretKey
    })

    return { jwt }

  } catch (error) {
    console.error(error)
    return "Unknown Server Error"
  }
}

export const auth = cache(async () => {
  const rawCookie = authCookie.readOnly.get()
  let session
  let errorMsg
  if (rawCookie) {
    try {
      session = await JWT.decode({ jwt: rawCookie, secret: secretKey })
    } catch (error) {
      console.error(error)
      errorMsg = JSON.stringify(error, null, 1)
    }
  }
  return {
    rawCookie,
    session,
    errorMsg
  }
})