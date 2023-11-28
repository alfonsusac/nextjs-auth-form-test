import { Cryptography } from "@/lib/crypto"
import { cache } from "react"
import { User } from "@/model/user"
import { UserPassword } from "@/model/password"
import { ClientError } from "@/lib/error/class"
import { Navigation } from "@/lib/error"
import { Verifications } from "./globals"
import { Session } from "./session"
import { PasswordStrategy } from "./strategy/password"
import { MagicLinkEmailStrategy } from "./strategy/magiclink"


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

  export const register = PasswordStrategy.register 
  export const login = PasswordStrategy.login
  export const loginWith2FA = PasswordStrategy.loginWith2FA
  export const requestForgotPassword = PasswordStrategy.requestForgotPassword
  export const resetPassword = PasswordStrategy.resetPassword

  export const requestPasswordlessLogin = MagicLinkEmailStrategy.requestLogin
  export const loginViaPasswordless = MagicLinkEmailStrategy.login
  export const registerViaPasswordless = MagicLinkEmailStrategy.register



  /**
   *  Logs user out
   */
  export async function logout() {
    Session.destroy()
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
export namespace AuthGuard {
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
    if (session) Navigation.redirectTo('/')
  }

}


export const getCurrentSession = cache(async (opts?: {
  onUnauthorized: () => void,
  onUnverified: () => void,
}) => {
  const payload = await Session.get()
  return payload
})
