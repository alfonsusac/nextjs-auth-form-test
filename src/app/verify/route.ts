import { auth, authCookie, userJWT, verificationJWT } from "@/api/authentication"
import { Error, redirect } from "@/lib/action"
import { UserVerification } from "@/model/user"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {

    const theSearchParam = request.nextUrl.searchParams.get('k')
    if (!theSearchParam) throw "the search param is empty"

    const jwtpayload = await verificationJWT.decode(theSearchParam)
    if (!jwtpayload) throw "the jwt payload is null"

    const key = jwtpayload.verification
    if (!key) throw "the key is undefined"

    await UserVerification.verifyKey(key)

    const { session } = await auth()
    if (!session) redirect('/login', 'success=Email Verified! Please Login')

    authCookie.set(await userJWT.encode({ ...session, verified: true }))

    redirect('/', 'success=Email Successfully Verified')

  } catch (error) {
    Error.handleActionError(error)

    if (error instanceof PrismaClientKnownRequestError) {
      console.log("Prisma Error")
      console.log(error)
      redirect('/verify/fail', 'error=Verification no longer valid. Please try again.')
    }

    console.log(error)
    redirect('/verify/fail', 'error=Unknown server error')


  }
}