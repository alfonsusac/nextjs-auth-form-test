import { Cryptography } from "@/lib/crypto"
import { JWTCookieHandler } from "@/lib/jwt"
import { Password, User } from "@/model/user"
import { cache } from "react"
import { Cookie } from "@/lib/cookies"
import { ClientError, InvalidCredentialsError, redirect } from "@/lib/error"


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
 */
export async function register({ username, email, password }: { username: string, email: string, password: string }) {

  // Hash the inputted password
  const hashedPwd = await Cryptography.hash(password)

  // Store the new user detail to the database
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
  if (!storedpassword) throw new InvalidCredentialsError("User not found")

  // Verify that the inputted password same as stored password
  if (!await Cryptography.verify(storedpassword.value, password))
    throw new InvalidCredentialsError("Password does not match")

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
 * ------ [ Auth Guard ] ------------------------------------------------
 */

/**
 *  Retrieves session from cookie.
 */
export const getCurrentUser = cache(async () => {
  const payload = await UserJWTCookie.getCookieAndDecode()
  return payload
})

export const redirectToHomeIfNotAuthenticated = cache(async () => {
  const session = await getCurrentUser()
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

  constructor(servermsg: string) {
    super("Not Authenticated. Please Sign in to continue.", servermsg)
    Object.setPrototypeOf(this, NotAuthenticated.prototype)
  }

}