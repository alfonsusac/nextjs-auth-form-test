import { UserJWTCookie } from "@/api/authentication"
import { Verifications } from "@/api/passwordless"
import { redirect } from "@/lib/error"
import { User, UserVerification } from "@/model/user"
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
      redirect('/passwordless/register')
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

    redirect('/', 'success=You are logged in!')
    
  }
  catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error

    console.log(error)
    redirect('/passwordless/register', 'error=Verification failed! Please try again.')
  }

}