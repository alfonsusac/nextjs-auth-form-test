import { Authentication, UserJWTCookie } from "@/api/authentication"
import { DecodingError, verifyEmailVerification } from "@/api/verification"
import { Navigation } from "@/lib/error"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {

  const theSearchParam = request.nextUrl.searchParams.get('k')
  if (!theSearchParam) Navigation.redirectTo('/')

  try {
    await verifyEmailVerification(theSearchParam)

    const session = await Authentication.getSession()
    if (!session) Navigation.redirectTo('/login', 'success=Email Verified! Please log in to continue.')

    await UserJWTCookie.encodeAndSetCookie({ ...session, verified: true })
    Navigation.redirectTo('/', 'success=Email Successfully Verified')

  }
  catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error

    if (error instanceof DecodingError)
      Navigation.redirectTo('/verify/fail', 'error=Verification no longer valid. Please try again.')

    console.log(error)
    Navigation.redirectTo('/verify/fail', 'error=Unknown server error')
  }
}

export const dynamic = 'force-dynamic'