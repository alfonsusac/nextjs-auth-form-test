import { Cryptography } from "@/lib/crypto"
import { JWT } from "@/lib/jwt"
import { User } from "@/model/user"
import { cache } from "react"
import { Cookie } from "@/lib/cookies"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { Error } from "@/lib/action"
import { resend } from "@/lib/email"

export const secretKey = "super secret key"

export const authCookie = Cookie.create('alfon-auth', {
  secure: true,
  httpOnly: true,
  sameSite: "strict"

})


/**
 * Logs users in.
 * - needs to be wrapped in try catch, User.find and Cryptography.veriy might fail.
 */
export async function login(username: string, password: string) {
  try {
    const user = await User.find(username)
    if (!user) return "User not found"

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

/**
 * Logs users in.
 * - needs to be wrapped in try catch, User.find and Cryptography.veriy might fail.
 */
export async function register(username: string, email: string, password: string) {
  try {

    const hashedPwd = await Cryptography.hash(password)
    const user = await User.create(username, email, hashedPwd)
    return user

  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        if (Error.includes(error.meta, "email")) {
          return "Email is already taken"
        }
        if (Error.includes(error.meta, "username")) {
          return "Username is already taken"
        }
      }
    }
    console.error(error)
    return "Unknown Server Error"
  }
}

export async function sendEmailVerification(email: string) {
  try {
    const data = await resend.emails.send({
      from: "Verification <verification@alfon.dev>",
      to: email,
      subject: 'Please verify your Email!',
      text: "Hello World",
    })
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