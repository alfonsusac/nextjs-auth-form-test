import { Authentication } from "@/api/authentication"
import { Navigation } from "@/lib/error"

export function LogoutButton() {
  return (
    <button formAction={ async () => {
      "use server"
      await Authentication.logout()
      Navigation.redirectTo('', `success=Successfully logged out`)
    }
    }>
      Log out
    </button>
  )
}