import { Authentication } from "@/api/authentication"
import { Verifications } from "@/api/globals"
import { Navigation } from "@/lib/error"
import { NextRequest } from "next/server"

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  console.log("Verifying Token Link from Search Params...")

  try {
    const data = await Verifications.passwordlessVerification.verify(
      request.nextUrl.searchParams.get('purpose') ?? "",
      request.nextUrl.searchParams.get('key') ?? ""
    )
    
    await Authentication.loginViaPasswordless(data)

    Navigation.redirectTo('/', 'success=You are logged in!')
  }
  catch (error: any) {
    Navigation.handleVerificationRouteError(error, '/passwordless/register')
  }

}