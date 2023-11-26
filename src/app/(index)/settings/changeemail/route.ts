import { Authentication } from "@/api/authentication"
import { Verifications } from "@/api/globals"
import { AccountManagement } from "@/api/user-management"
import { InvalidSearchParam } from "@/api/verification"
import { Navigation } from "@/lib/error"
import { ClientErrorBaseClass } from "@/lib/error/class"
import { NextRequest } from "next/server"

export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  
  try {
    const data = await Verifications.changeEmail.verify(
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