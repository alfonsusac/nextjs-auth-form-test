import { User } from "@/model/user"
import { Verifications } from "./globals"
import { Session } from "./session"


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
  await Verifications.passwordlessVerification.send(email, { email })
}

/**
 *  Verify passwordless login
 */

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
  await Session.create({
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