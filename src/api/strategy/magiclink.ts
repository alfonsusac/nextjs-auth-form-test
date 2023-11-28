import { User } from "@/model/user"
import { Verifications } from "../globals"
import { Session } from "../session"
import { Navigation } from "@/lib/error"
import { UserVerification } from "@/model/verification"

export namespace MagicLinkEmailStrategy {
  export async function requestLogin({ email }: {
    email: string
  }) {
    console.log("Sending Passwordless Email Verification")
    await Verifications.passwordlessVerification.send(email, { email })
  }

  export async function login({ email }: {
    email:string
  }) {
    const user = await User.findEmail(email)

    if (!user) {
      await Session.create({
        username: "",
        email,
        verified: true,
      })
      Navigation.redirectTo('/passwordless/register')
    }

    if (!user.verification?.verified) {
      const verification = await UserVerification.setKey(user.username)
      await UserVerification.verifyKey(verification.id)
    }

    await Session.create({
      username: user.username,
      email: user.email,
      verified: true,
    })
  }

  export async function register({ username, email }: {
    username: string,
    email: string
  }) {
    const user = await User.create({ username, email, provider: "magiclink", hashedPassword: undefined })
    if (!user) throw new Error('User unexpectedly not created')

    await Session.create({
      username: user.username,
      email: user.email,
      verified: true,
    })
  }
}