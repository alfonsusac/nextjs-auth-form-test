import { Authentication } from "@/api/authentication"
import { AccountManagement, LoggedInUser } from "@/api/account"
import { Navigation } from "@/lib/error"
import prisma from "@/lib/singleton"

export async function IfNotLoggedIn({ children }: any) {
  const session = await Authentication.getSession()
  return !session && children
}

export async function IfLoggedIn({ children }: any) {
  const session = await Authentication.getSession()
  if (session && !session.username) Navigation.redirectTo('/passwordless/register')

  return session && children
}

export async function IfNotVerified({ children }: any) {
  const session = await Authentication.getSession()
  return !session?.verified && children
}
export async function IfVerified({ children }: any) {
  const session = await Authentication.getSession()
  return session?.verified && children
}

export async function IfApp2FAEnabled({ children }: any) {
  const session = await Authentication.getSession()
  if (!session) return null
  const enabled = await AccountManagement.is2FAEnabled(session)
  return enabled && children
}

export async function IfApp2FADisabled({ children }: any) {
  const session = await Authentication.getSession()
  if (!session) return null
  const enabled = await AccountManagement.is2FAEnabled(session)
  return !enabled && children
}

export async function IfUsingMagicLink({ children }: any) {
  const user = await LoggedInUser.getUser()
  return (user.provider === "magiclink") && children
}

export async function IfNotUsingMagicLink({ children }: any) {
  const user = await LoggedInUser.getUser()
  return (user.provider !== "magiclink") && children
}

export async function IfUsingPasswordLogin({ children }: any) {
  const user = await LoggedInUser.getUser()
  return (user.provider === "password") && children
}

export async function IfUsingWebAuthn({ children }: any) {
  const user = await LoggedInUser.getUser()
  const deviceAuths = await prisma.userDeviceAuth.findMany({ where: { username: user.username } })
  return (deviceAuths.length > 0) && children
}
export async function IfNotUsingWebAuthn({ children }: any) {
  const user = await LoggedInUser.getUser()
  const deviceAuths = await prisma.userDeviceAuth.findMany({ where: { username: user.username } })
  return (deviceAuths.length === 0) && children
}
export async function UserWebAuthnNumber() {
  const user = await LoggedInUser.getUser()
  const deviceAuths = await prisma.userDeviceAuth.findMany({ where: { username: user.username } })
  return deviceAuths.length
}