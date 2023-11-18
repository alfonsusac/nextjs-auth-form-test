import { getCurrentUser, UserJWTCookie } from "@/api/authentication"
import { InvalidVerificationError, verifyEmailVerification } from "@/api/verification"
import { redirect } from "@/lib/error"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {

  const theSearchParam = request.nextUrl.searchParams.get('k')
  if (!theSearchParam) redirect('/')

  try {

    await verifyEmailVerification(theSearchParam)

    const session = await getCurrentUser()
    if (!session) redirect('/login', 'error=Not Authenticated')

    await UserJWTCookie.encodeAndSetCookie({ ...session, verified: true })

    redirect('/', 'success=Email Successfully Verified')


  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error

    if (error instanceof InvalidVerificationError)
      redirect('/verify/fail', 'error=Verification no longer valid. Please try again.')

    console.log(error)
    redirect('/verify/fail', 'error=Unknown server error')
  }
  
}