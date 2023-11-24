import { Cryptography } from "@/lib/crypto"
import { JWTCookieHandler } from "@/lib/jwt"
import { cache } from "react"
import { Cookie } from "@/lib/cookies"
import { ClientError, InvalidCredentialClientError, redirect } from "@/lib/error"
import { EmailVerification } from "./verification"
import { User } from "@/model/user"
import { Password } from "@/model/password"


/** ========================================================================================
*
*  ⭐ [Public Object] ⭐
*
* ========================================================================================
*/
/** 
 *  Constants
 */
export const secretKey = "super secret key"
export const duration24hour = 1000 * 60 * 60 * 24
export const emailVerificationExpiryDate = () => new Date(Date.now() + duration24hour) // 24h

/** 
 *  Authentication Cookie Object
 */
export const authCookie = Cookie.create('alfon-auth', {
  secure: true,
  httpOnly: true,
  sameSite: "lax"
})
/** 
 *  User JWT Object
 */
export const UserJWTCookie = new JWTCookieHandler
  <
    {
      username: string
      email: string
      verified: boolean
    }
  >("alfon-auth", "24 h")


/** ========================================================================================
*
*  🔨 [Public Functions] 🔨
*
* ========================================================================================
*/
/**
 *  Register User
 *  - hashes inputted password
 *  - and store the new user detail to database
 */
export async function register({ username, email, password }: { username: string, email: string, password: string }) {
  const hashedPwd = await Cryptography.hash(password)
  return await User.create({
    username,
    email,
    provider: "password",
    password: hashedPwd
  })
}


/**
 *  Logs user in.
 */
export async function login({ username, password }: { username: string, password: string }) {

  // Find stored password in the database based on username
  const storedpassword = await Password.find(username)
  if (!storedpassword) throw new InvalidCredentialClientError("User not found")

  // Verify that the inputted password same as stored password
  if (!await Cryptography.verify(storedpassword.value, password))
    throw new InvalidCredentialClientError("Password does not match")

  // Create JWT and set Cookie of the current session
  const { user } = storedpassword
  await UserJWTCookie.encodeAndSetCookie({
    username: user.username,
    email: user.email,
    verified: user.verification?.verified ?? false,
  })

}
/**
 *  Logs user out
 */
export async function logout() {
  UserJWTCookie.deleteCookie()
  return
}

/**
 *  Forgot Password
 */

export namespace Verifications{
  export const forgotPassword = new EmailVerification<{
    username: string
  }>("forgotpassword", "1d",
    "One-time link to reset password",
    (url) => `Reset your password here: ${url}`,
    "/forgotpassword/reset",
  )
}

export async function sendForgotPasswordEmail({ email }: { email: string }) {

  const user = await User.findEmail(email)
  if (!user) throw new ClientError("Email not found!")

  if (user.provider === "magiclink")
    throw new ClientError("This user is using passwordless. Login with passwordless instead!")

  await Verifications.forgotPassword.send(email, {
    username: user.username,
  })

}

export async function resetPassword({ username, newPassword }: {
  username: string,
  newPassword: string
}) {
  // Hash the inputted password
  const hashedPwd = await Cryptography.hash(newPassword)

  // Store the new user detail to the database
  return await Password.forceUpdate({
    username,
    newPasswordHash: hashedPwd
  })
}


/**
 * ------ [ Auth Guard ] ------------------------------------------------
 */

/**
 *  Retrieves session from cookie.
 */
export function AuthGuard(p: {
  
}) {
  
}


export const getCurrentSession = cache(async (opts?: {
  onUnauthorized: () => void,
  onUnverified: () => void,
}) => {
  const payload = await UserJWTCookie.getCookieAndDecode()
  return payload
})

export const getUserAndRedirectToHomeIfNotAuthenticated = cache(async () => {
  const session = await getCurrentSession()
  if (!session) redirect('/', 'error=Not Authenticated. Please log in again.')
  if (!session.username) redirect('/passwordless/register')
  return session
})


/** ========================================================================================
*
*  🚧 [Error Class] 🚧
*
* ========================================================================================
*/
export class NotAuthenticated extends ClientError {

  constructor() {
    super("Not Authenticated. Please Sign in to continue.")
  }

}