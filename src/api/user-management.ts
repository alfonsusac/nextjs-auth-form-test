import { Authentication, UserJWTCookie } from "./authentication"
import { Cryptography } from "@/lib/crypto"
import { User } from "@/model/user"
import { Password } from "@/model/password"
import { Navigation } from "@/lib/error"
import { ClientError } from "@/lib/error/class"





export namespace LoggedInUser {
  export async function getUser() {
    const { username } = await Authentication.requireSession()
    const user = await User.findUsername(username)
    if (!user) {
      await Authentication.logout()
      Navigation.notAuthenticated()
    }
    return user
  }
  export async function isVerified() {
    const user = await Authentication.requireSession()
    return user.verified
  }
  export async function usingMagicLink() {
    const user = await getUser()
    return !!(user.provider === "magiclink")
  }
}

export namespace AccountManagement {

  export async function deleteUser(p: { username: string, email: string }) {
    await User.remove(p.username, p.email)
    await Authentication.logout()
  }

  export async function changePassword({ newPassword, oldPassword, username }: {
    username: string
    oldPassword: string,
    newPassword: string
  }) {
    const storedPassword = await Password.find(username)
    if (!storedPassword) ClientError.invalidInput("User not found! User may be using passwordless login.")

    const valid = await Cryptography.verify(storedPassword.value, oldPassword)
    if (!valid) ClientError.invalidInput("Password doesn't match! Please enter old password.")

    const hashedNewPassword = await Cryptography.hash(newPassword)
    await Password.update(username, storedPassword.value, hashedNewPassword)
  }

  export async function changeUsername({ oldUsername, newUsername, email }: { oldUsername: string, newUsername: string, email: string }) {
    await User.updateUsername(oldUsername, email, newUsername)
    await UserJWTCookie.updateJWTandSetCookie((token) => {
      token.username = newUsername
      return token
    })
  }


  export async function changeEmail({ username, oldEmail, newEmail }: { username: string, oldEmail: string, newEmail: string }) {
    await User.changeEmail(username, oldEmail, newEmail)
    await UserJWTCookie.updateJWTandSetCookie((token) => {
      token.email = newEmail
      return token
    })
  }

}


