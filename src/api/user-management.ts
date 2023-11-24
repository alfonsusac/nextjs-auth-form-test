import { Authentication, getCurrentSession } from "./authentication"
import { Cryptography } from "@/lib/crypto"
import { User } from "@/model/user"
import { Password } from "@/model/password"
import { Navigation } from "@/lib/error"
import { ClientError } from "@/lib/error/class"





export namespace LoggedInUser {

  export async function getUser() {
    const session = await getCurrentSession()
    if (!session) Navigation.notAuthenticated()
    const user = await User.findUsername(session.username)
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

export namespace UserManagement{
  export async function deleteUser(p:{ username: string, email: string }) {
    await User.remove(p.username, p.email)
    await Authentication.logout()
  }

}



export async function changePassword({ newPassword, oldPassword, username }: {
  username: string
  oldPassword: string,
  newPassword: string
}) {
  const storedPassword = await Password.find(username)
  if (!storedPassword) throw new Error("User not found")

  const valid = await Cryptography.verify(storedPassword.value, oldPassword)
  if (!valid) ClientError.invalidInput("Password doesn't match! Please enter old password.")

  const hashedNewPassword = await Cryptography.hash(newPassword)
  await Password.update(username, storedPassword.value, hashedNewPassword)
}