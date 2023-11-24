import { Authentication } from "@/api/authentication"
import { redirectTo } from "@/lib/error"

export function LogoutButton() {
  return (
    <button formAction={ async () => {
      "use server"
      await Authentication.logout()
      redirectTo('', `success=Successfully logged out`)
    }
    }>
      Log out
    </button>
  )
}