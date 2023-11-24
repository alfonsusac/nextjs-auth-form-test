import { Authentication } from "@/api/authentication"
import { Navigation, redirectTo } from "@/lib/error"

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

export async function AuthGuard(p: {
  verified?: boolean
  redirectTo?: string
}) {
  const session = await Authentication.getSession()
  if (!session) redirectTo('/login', 'error=You are not authorized!')
  if(p.verified && !session.verified) redirectTo('/', 'error=You need to verify your email!')
  return <></>
}

