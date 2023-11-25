import { UserJWTCookie } from "@/api/authentication"
import { Verifications } from "@/api/globals"
import { redirectTo } from "@/lib/error"
import { User } from "@/model/user"
import { UserVerification } from "@/model/verification"
import { NextRequest } from "next/server"

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  console.log("Verifying Token Link from Search Params...")

  try {
    const data = await Verifications.passwordlessVerification.verify(request.nextUrl.searchParams.get('purpose') ?? "", request.nextUrl.searchParams.get('key') ?? "")
    const user = await User.findEmail(data.email)

    if (!user) {
      await UserJWTCookie.encodeAndSetCookie({
        username: "",
        email: data.email,
        verified: true,
      })
      redirectTo('/passwordless/register')
    }

    if (!user.verification?.verified) {
      const verification = await UserVerification.setKey(user.username)
      await UserVerification.verifyKey(verification.id)
    }

    await UserJWTCookie.encodeAndSetCookie({
      username: user.username,
      email: user.email,
      verified: true,
    })

    redirectTo('/', 'success=You are logged in!')
    
  }
  catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error

    console.log(error)
    redirectTo('/passwordless/register', 'error=Verification failed! Please try again.')
  }

}