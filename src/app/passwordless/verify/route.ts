import { UserJWTCookie } from "@/api/authentication"
import { passwordlessVerify } from "@/api/passwordless"
import { redirect } from "@/lib/error"
import { User, UserVerification } from "@/model/user"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  console.log("Verifying Token Link from Search Params...")

  const jwtFromSearchParam = request.nextUrl.searchParams.get('k')
  if (!jwtFromSearchParam) redirect('/passwordless')

  try {
    const { payload, verified } = await passwordlessVerify(jwtFromSearchParam)

    if (!verified)
      redirect('/passwordless', 'error=Verification failed! Please try again.')

    const user = await User.findEmail(payload.email)

    if (!user) {
      await UserJWTCookie.encodeAndSetCookie({
        username: "",
        email: payload.email,
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