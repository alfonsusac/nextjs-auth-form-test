import { Cryptography } from "@/lib/crypto"
import { cache } from "react"
import { User } from "@/model/user"
import { Password } from "@/model/password"
import { ClientError } from "@/lib/error/class"
import { Navigation } from "@/lib/error"
import { Verifications } from "./globals"
import { Session } from "./session"


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
    await User.create({
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

    const storedpassword = await Password.find(username)
    if (!storedpassword) ClientError.invalidCredential("User not found")

    if (!await Cryptography.verify(storedpassword.value, password))
      ClientError.invalidCredential("Password does not match")

    const { user } = storedpassword
    await Session.create({
      username: user.username,
      email: user.email,
      verified: user.verification?.verified ?? false,
    })
  }
  
  /**
   *  Logs user out
   */
  export async function logout() {
    Session.destroy()
  }

  /**
   *  Forgot Password
   */
  export async function requestForgotPassword({ email }: { email: string }) {

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
    return await Session.get()
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
  const payload = await Session.get()
  return payload
})
