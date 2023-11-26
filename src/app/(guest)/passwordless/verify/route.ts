import { Verifications } from "@/api/globals"
import { Session } from "@/api/session"
import { Navigation, redirectTo } from "@/lib/error"
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
      await Session.create({
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

    await Session.create({
      username: user.username,
      email: user.email,
      verified: true,
    })

    redirectTo('/', 'success=You are logged in!')
    
  }
  catch (error: any) {
    Navigation.handleVerificationRouteError(error, '/passwordless/register')
  }

}