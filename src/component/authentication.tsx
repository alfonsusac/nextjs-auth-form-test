import { Authentication } from "@/api/authentication"
import { AccountManagement, LoggedInUser } from "@/api/account"
import { Navigation } from "@/lib/error"

export async function IfNotLoggedIn(p: {
  children?: React.ReactNode
}) {
  const session = await Authentication.getSession()
  return <>{ !session && p.children }</>
}

export async function IfLoggedIn(p: {
  children?: React.ReactNode
}) {
  const session = await Authentication.getSession()
  if(session && !session.username) Navigation.redirectTo('/passwordless/register')

  return <>{ session && p.children }</>
}

export async function IfNotVerified(p: {
  children?: React.ReactNode
}) {
  const session = await Authentication.getSession()
  return <>{ !session?.verified && p.children }</>
}
export async function IfVerified(p: {
  children?: React.ReactNode
}) {
  const session = await Authentication.getSession()
  return <>{ session?.verified && p.children }</>
}

export async function IfApp2FAEnabled(p: {
  children?: React.ReactNode
}) {
  const session = await Authentication.getSession()
  if(!session) return null
  const enabled = await AccountManagement.is2FAEnabled(session)
  return <>{ enabled && p.children }</>
}

export async function IfApp2FADisabled(p: {
  children?: React.ReactNode
}) {
  const session = await Authentication.getSession()
  if (!session) return null
  const enabled = await AccountManagement.is2FAEnabled(session)
  return <>{ !enabled && p.children }</>
}

export async function IfUsingMagicLink(p: {
  children?: React.ReactNode
}) {
  const user = await LoggedInUser.getUser()
  if (!user) return null
  return <>{ (user.provider==="magiclink") && p.children }</>
}

export async function IfNotUsingMagicLink(p: {
  children?: React.ReactNode
}) {
  const user = await LoggedInUser.getUser()
  if (!user) return null
  return <>{ (user.provider !== "magiclink") && p.children }</>
}