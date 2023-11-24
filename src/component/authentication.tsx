import { getCurrentSession } from "@/api/authentication"
import { redirect } from "@/lib/error"

export async function IfNotLoggedIn(p: {
  children?: React.ReactNode
}) {
  const session = await getCurrentSession()
  return <>{ !session && p.children }</>
}

export async function IfLoggedIn(p: {
  children?: React.ReactNode
}) {
  const session = await getCurrentSession()
  return <>{ session && p.children }</>
}

export async function IfNotVerified(p: {
  children?: React.ReactNode
}) {
  const session = await getCurrentSession()
  return <>{ !session?.verified && p.children }</>
}
export async function IfVerified(p: {
  children?: React.ReactNode
}) {
  const session = await getCurrentSession()
  return <>{ session?.verified && p.children }</>
}

export async function AuthGuard(p: {
  verified?: boolean
  redirectTo?: string
}) {
  const session = await getCurrentSession()
  if (!session) redirect('/login', 'error=You are not authorized!')
  if(p.verified && !session.verified) redirect('/', 'error=You need to verify your email!')
  return <></>
}

