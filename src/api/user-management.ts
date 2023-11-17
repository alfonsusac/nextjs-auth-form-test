import { User } from "@/model/user"
import { getCurrentUser, logout } from "./authentication"
import { handleActionError, redirect } from "@/lib/error"

export async function deleteUser() { 
  "use server"
  try {
    const user = await getCurrentUser()
    if (!user) redirect('/', 'error=Not Authenticated. Please log in again.')
    await User.remove(user.username, user.email)
    await logout() // literally only delete auth cookies
    redirect('/', 'success=Account successfully deleted!')
  }
  catch (error) {
    handleActionError(error)
  }
}
