import { logout } from "@/api/authentication"
import { redirect } from "@/lib/error"

export function LogoutButton() {
  return (
    <button formAction={ async () => {
      "use server"
      await logout()
      redirect('', `success=Successfully logged out`)
    }
    }>
      Log out
    </button>
  )
}