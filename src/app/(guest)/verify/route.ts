import { Authentication } from "@/api/authentication"
import { Session } from "@/api/session"
import { verifyEmailVerification } from "@/api/verification"
import { DecodingError, Navigation } from "@/lib/error"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {

  const theSearchParam = request.nextUrl.searchParams.get('k')
  if (!theSearchParam) Navigation.redirectTo('/')

  try {
    await verifyEmailVerification(theSearchParam)

    const session = await Authentication.getSession()
    if (!session) Navigation.redirectTo('/login', 'success=Email Verified! Please log in to continue.')

    await Session.update(old => ({ ...old, verified: true }))
    Navigation.redirectTo('/', 'success=Email Successfully Verified')

  }
  catch (error: any) {
    if (error instanceof DecodingError) {
      Navigation.redirectTo('/verify/fail', 'error=Verification no longer valid. Please try again.')
    }
    Navigation.handleVerificationRouteError(error, '/verify/fail')
  }
}

export const dynamic = 'force-dynamic'