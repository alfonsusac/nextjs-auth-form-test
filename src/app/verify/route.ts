import { getCurrentSession, UserJWTCookie } from "@/api/authentication"
import { DecodingError, verifyEmailVerification } from "@/api/verification"
import { redirectTo } from "@/lib/error"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {

  const theSearchParam = request.nextUrl.searchParams.get('k')
  if (!theSearchParam) redirectTo('/')

  try {
    await verifyEmailVerification(theSearchParam)

    const session = await getCurrentSession()
    if (!session) redirectTo('/login', 'success=Email Verified! Please log in to continue.')

    await UserJWTCookie.encodeAndSetCookie({ ...session, verified: true })
    redirectTo('/', 'success=Email Successfully Verified')

  }
  catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error

    if (error instanceof DecodingError)
      redirectTo('/verify/fail', 'error=Verification no longer valid. Please try again.')

    console.log(error)
    redirectTo('/verify/fail', 'error=Unknown server error')
  }
}

export const dynamic = 'force-dynamic'