import { Cryptography } from "@/lib/crypto"
import { JWT, newJWT } from "@/lib/jwt"
import { User, UserVerification } from "@/model/user"
import { cache } from "react"
import { Cookie } from "@/lib/cookies"
import { PrismaClientKnownRequestError, raw } from "@prisma/client/runtime/library"
import { Error } from "@/lib/action"
import { resend } from "@/lib/email"
import { Request } from "@/lib/referrer"

export const secretKey = "super secret key"
export const duration24hour = 1000 * 60 * 60 * 24
export const emailVerificationExpiryDate = () => new Date(Date.now() + duration24hour) // 24h


export const authCookie = Cookie.create('alfon-auth', {
  secure: true,
  httpOnly: true,
  sameSite: "lax"
})
export const userJWT = newJWT<{
  username: string
  email: string
  verified: boolean
}>(duration24hour)


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

    const jwt = await userJWT.encode({
      username: user.username,
      email: user.email,
      verified: user.verification?.verified ?? false,
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

export const verificationJWT = newJWT<{
  verification: string
}>(duration24hour)

export async function sendEmailVerification(username: string, email: string) {
  try {

    const verification = await UserVerification.setKey(username)
    const signedVerification = await verificationJWT.encode({ verification: verification.id })

    const host = Request.getServerBaseURL()


    const data = await resend.emails.send({
      from: "Verification <verification@alfon.dev>",
      to: email,
      subject: 'Welcome! Please verify your Email',
      text: `Hi ${username}\nThis is for Alfon's Personal Learning Journey of Authentication. Verification Link: ${host}/verify/?k=${signedVerification}`,
    })
    console.log(data)

  } catch (error) {

    console.error(error)
    return "Unknown Server Error"

  }
}
export async function verifyVerificationKey(key: string) {
  
}

/**
 * Retrieves session from cookie.
 */
export const auth = cache(async () => {
  const rawCookie = authCookie.readOnly.get()
  if (!rawCookie)
    return {
      errorMsg: JSON.stringify("Auth Cookie Not Found")
    }
  
  try {
    const session = await userJWT.decode(rawCookie)
    return {
      rawCookie,
      session,
    }
  } catch (error) {
    console.error(error)
    return {
      rawCookie,
      errorMsg: JSON.stringify(error, null, 1)
    }
  }
})