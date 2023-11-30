import { Authentication } from "./authentication"
import { Cryptography } from "@/lib/crypto"
import { User } from "@/model/user"
import { UserPassword } from "@/model/userpassword"
import { Navigation } from "@/lib/error"
import { ClientError } from "@/lib/error/class"
import { Session } from "./session"
import { User2FA } from "@/model/user2fa"


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
  export async function deleteUser(input: { username: string, email: string }) {
    await User.remove(input)
    await Authentication.logout()
  }

  export async function changePassword({ newPassword, oldPassword, username }: {
    username: string
    oldPassword: string,
    newPassword: string
  }) {
    const storedPassword = await UserPassword.find(username)
    if (!storedPassword) ClientError.invalidInput("User not found! User may be using passwordless login.")

    const valid = await Cryptography.verify(storedPassword.value, oldPassword)
    if (!valid) ClientError.invalidInput("Password doesn't match! Please enter old password.")

    const hashedNewPassword = await Cryptography.hash(newPassword)
    await UserPassword.update(username, storedPassword.value, hashedNewPassword)
  }

  export async function changeUsername({ oldUsername, newUsername, email }: {
    oldUsername: string,
    newUsername: string,
    email: string
  }) {
    await User.updateUsername(oldUsername, email, newUsername)
    await Session.update(token => {
      token.username = newUsername
      return token
    })
  }

  export async function changeEmail({ username, oldEmail, newEmail }: {
    username: string,
    oldEmail: string,
    newEmail: string
  }) {
    await User.updateEmail(username, oldEmail, newEmail)
    await Session.update(token => {
      token.email = newEmail
      return token
    })
  }

  export async function  set2FA(param: {
    username: string,
    twofasecret: string,
  }) {
    await User2FA.set(param)
  }

  export async function disable2FA(param: {
    username: string,
  }) {
    await User2FA.remove(param)
  }

  export async function is2FAEnabled(param: {
    username: string
  }) {
    return await User2FA.find(param)
  }

}


