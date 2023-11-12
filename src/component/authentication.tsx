import { auth } from "@/api/authentication"

export async function ShowWhenLoggedIn(p: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { session } = await auth()
  return <>
    {
      session ? p.children : (p.fallback ?? null)
    }
  </>
}