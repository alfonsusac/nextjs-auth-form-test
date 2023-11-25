import { Cryptography } from "@/lib/crypto"
import { JWTCookieHandler } from "@/lib/jwt"
import { cache } from "react"
import { Cookie } from "@/lib/cookies"
import { EmailVerification } from "./verification"
import { User } from "@/model/user"
import { Password } from "@/model/password"
import { ClientErrorBaseClass, ClientError } from "@/lib/error/class"
import { Navigation, redirectTo } from "@/lib/error"
import { Verifications } from "./globals"


/** ========================================================================================
*
*  ⭐ [Public Object] ⭐
*
* ========================================================================================
*/
/** 
 *  Constants
 */
export const duration24hour = 1000 * 60 * 60 * 24
export const emailVerificationExpiryDate = () => new Date(Date.now() + duration24hour) // 24h
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
 * The Authentication Namespace is concerned with performing authentication methods
 * such as login, register, and logout.
 */
export namespace Authentication {
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
    if (!storedpassword) ClientError.invalidCredential("User not found")

    // Verify that the inputted password same as stored password
    if (!await Cryptography.verify(storedpassword.value, password))
      ClientError.invalidCredential("Password does not match")

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
  }

  /**
   *  Forgot Password
   */
  export async function sendForgotPasswordEmail({ email }: { email: string }) {

    const user = await User.findEmail(email)
    if (!user)
      ClientError.invalidInput("Email not found!")
    if (user.provider === "magiclink")
      ClientError.invalidInput("This user is using passwordless. Login with passwordless instead!")

    await Verifications.forgotPassword.send(email, {
      username: user.username,
    })
  }

  /**
   *  Reset Password
   */
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

  
  export const getSession = cache(async function () {
    const payload = await UserJWTCookie.getCookieAndDecode()
    return payload
  })

  export async function requireSession() {
    const session = await getSession()
    if (!session)
      Navigation.notAuthenticated()
    if (!session.username)
      Navigation.redirectTo('/passwordless/register')
    return session
  }

  export async function requireVerifiedSession() {
    const session = await requireSession()
    if (!session.verified)
      Navigation.notVerified()
    return session
  }
  
}

/**
 * ------ [ Auth Guard ] ------------------------------------------------
 */
export namespace AuthGuard{
  export async function memberOnly() {
    const session = await Authentication.getSession()
  }
  export async function usernamelessOnly() {
    const session = await Authentication.getSession()
    console.log("User's username")
    console.log(session?.username)
    console.log("User's: " + !!session)
    console.log("User's username: " + !!session?.username)
    if (!session)
      Navigation.redirectTo('/', 'error=Not Authenticated. Please log in again.')
    if (session.username)
      Navigation.redirectTo('/')
    return session
  }
  export async function guestOnly() {
    const session = await Authentication.getSession()
    if(session) Navigation.redirectTo('/')
  }

}


export const getCurrentSession = cache(async (opts?: {
  onUnauthorized: () => void,
  onUnverified: () => void,
}) => {
  const payload = await UserJWTCookie.getCookieAndDecode()
  return payload
})
