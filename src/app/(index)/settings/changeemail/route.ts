import { Verifications } from "@/api/globals"
import { AccountManagement } from "@/api/user-management"
import { InvalidSearchParam } from "@/api/verification"
import { Navigation } from "@/lib/error"
import { NextRequest } from "next/server"

export const dynamic = 'force-dynamic'
export default async function GET(request: NextRequest) {
  
  try {
    const data = await Verifications.changeEmail.verify(
      request.nextUrl.searchParams.get('purpose') ?? "",
      request.nextUrl.searchParams.get('key') ?? "",
    )
    await AccountManagement.changeEmail({
      username: data.username,
      oldEmail: "",
      newEmail: data.email,
    })
  } catch (error) {
    if (error instanceof InvalidSearchParam) {
      Navigation.redirectTo('/')
    }
    console.log("Error verifying incoming request")
    console.log(error)
    Navigation.redirectTo('/settings', 'error=Verification Failed. Please try again')
  }

}