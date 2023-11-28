import { Authentication } from "@/api/authentication"
import { Verifications } from "@/api/globals"
import { AccountManagement } from "@/api/account"
import { Navigation } from "@/lib/error"
import { NextRequest } from "next/server"

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  
  try {
    const data = await Verifications.changeEmailVerification.verify(
      request.nextUrl.searchParams.get('purpose') ?? "",
      request.nextUrl.searchParams.get('key') ?? "",
    )

    const session = await Authentication.requireSession()

    await AccountManagement.changeEmail({
      username: data.username,
      oldEmail: session.email,
      newEmail: data.email,
    })

    Navigation.redirectTo('/settings', 'success=Email successfully changed!')
  } catch (error: any) {
    Navigation.handleVerificationRouteError(error, '/settings')
  }

}