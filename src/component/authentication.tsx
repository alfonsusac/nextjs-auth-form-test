import { getCurrentUser } from "@/api/authentication"

export async function IfNotLoggedIn(p: {
  children: React.ReactNode
}) {
  const session = await getCurrentUser()
  return <>{ !session && p.children }</>
}

export async function IfLoggedIn(p: {
  children: React.ReactNode
}) {
  const session = await getCurrentUser()
  return <>{ session && p.children }</>
}

export async function IfNotVerified(p: {
  children: React.ReactNode
}) {
  const session = await getCurrentUser()
  return <>{ !session?.verified && p.children }</>
}
