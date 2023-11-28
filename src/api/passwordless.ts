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
 *  Verify passwordless login
 */

export async function registerPasswordless(username: string, email: string) {
  const user = await User.create({
    username,
    email,
    provider: "magiclink",
    hashedPassword: undefined
  })
  if (!user) {
    throw new Error('User is unexpectedly not created? ')
  }
  await Session.create({
    username: user.username,
    email: user.email,
    verified: true,
  })
}

