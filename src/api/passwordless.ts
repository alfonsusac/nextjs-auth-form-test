import { User } from "@/model/user"
import { EmailVerification } from "./verification"
import { JWTCookieHandler } from "@/lib/jwt"
import { redirect } from "@/lib/error"
import { UserJWTCookie } from "./authentication"

const passwordlessVerification = new EmailVerification(
  "passwordless",
  "1d",
  "Magic one-time use link authentication",
  (h, t) => `Hi! One time login link: ${h}/passwordless/verify?k=${t}`
)
const passwordlessSetupCookie = new JWTCookieHandler<{ email: string }>(
  "alfon-auth-temp-passwordless",
  "1d",
)



/** ========================================================================================
*
*  🔨 [Public Functions] 🔨
*
* ========================================================================================
*/


/**
 *  Logs user in using passwordless or create new user
 */
export async function passwordlessInitialize(email: string) {
  console.log("Sending Passwordless Email Verification")
  await passwordlessVerification.send(email)
}

/**
 *  Verify passwordless login
 */
export async function passwordlessVerify(jwt: string) {
  console.log("Verifying Passwordless Flow")
  return await passwordlessVerification.verify(jwt)
}

export async function registerPasswordless(username: string, email: string) {
  const user = await User.create({
    username,
    email,
    provider: "magiclink",
    password: undefined
  })
  if (!user) {
    throw new Error('User is unexpectedly created? ')
  }
  await UserJWTCookie.encodeAndSetCookie({
    username: user.username,
    email: user.email,
    verified: true,
  })

}


/** ========================================================================================
*
*  🚧 [Error Class] 🚧
*
* ========================================================================================
*/