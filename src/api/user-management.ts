import { getCurrentSession, getUserAndRedirectToHomeIfNotAuthenticated, logout } from "./authentication"
import { ClientError, DeveloperError, notAuthenticated } from "@/lib/error"
import { Cryptography } from "@/lib/crypto"
import { User } from "@/model/user"
import { Password } from "@/model/password"

export async function getUserAccount() {
  const session = await getCurrentSession()
  if (!session) notAuthenticated()
  const user = await User.findUsername(session.username)
  if (!user) {
    await logout()
    notAuthenticated()
  }
  return user
}
export namespace LoggedInUser {
  export async function getSession() {
    const session = await getCurrentSession()
    if (!session) notAuthenticated()
    return session
  }
  export async function getUser() {
    const session = await getCurrentSession()
    if (!session) notAuthenticated()
    const user = await User.findUsername(session.username)
    if (!user) {
      await logout()
      notAuthenticated()
    }
    return user
  }
  export async function isVerified() {
    const user = await getUserAccount()
    return !!user.verification?.verified
  }
  export async function usingMagicLink() {
    const user = await getUserAccount()
    return !!(user.provider === "magiclink")
  }
}

export async function deleteUser() {
  const user = await getCurrentSession()
  if (!user) notAuthenticated()

  await User.remove(user.username, user.email)
  await logout()
}


export async function changePassword({ newPassword, oldPassword }: {
  oldPassword: string,
  newPassword: string
}) {
  const user = await getUserAndRedirectToHomeIfNotAuthenticated()
  const storedPassword = await Password.find(user.username)
  if (!storedPassword) throw new DeveloperError("User not found")

  const valid = await Cryptography.verify(storedPassword.value, oldPassword)
  if (!valid) throw new ClientError("Password doesn't match! Please enter old password.")

  const hashedNewPassword = await Cryptography.hash(newPassword)
  await Password.update(user.username, storedPassword.value, hashedNewPassword)
}