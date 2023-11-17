import { redirectToHomeIfNotAuthenticated, getCurrentUser, logout } from "@/api/authentication"
import { deleteUser } from "@/api/user-management"
import { sendEmailVerification } from "@/api/verification"
import { IfNotLoggedIn, IfLoggedIn, IfNotVerified } from "@/component/authentication"
import { SearchParamStateCallout } from "@/component/searchParams"
import { handleActionError, redirect } from "@/lib/error"


export default async function HomePage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const session = await getCurrentUser()

  return (
    <article>
      <SearchParamStateCallout searchParams={ searchParams } />
      <h2> Welcome! </h2>
      <span>
        { session?.username ? `Logged in as: ${session?.username}` : `Not Logged in` }
      </span><br />

      <IfNotLoggedIn>
        <form>
          <a href="/login" data-primary>Log in</a>
          <a href="/register" data-primary>Register</a>
        </form>
      </IfNotLoggedIn>
      <IfLoggedIn>
        <form>
          <IfNotVerified>
            <button type="submit" formAction={ async () => {

              "use server"
              const session = await redirectToHomeIfNotAuthenticated()
              await sendEmailVerification(session.username, session.email)
              redirect('/', 'success=Successful! Your email is verified.')

            }
            }>
              Verify Email
            </button>
          </IfNotVerified>
          <button formAction={ async () => {

            "use server"

            await logout()

            redirect('', `success=Successfully logged out`)
          }
          }>
            Log out
          </button>

          <button formAction={ async () => { "use server"; try { await deleteUser() } catch (error) { handleActionError(error) } } }>
            Delete Account
          </button>

        </form>
      </IfLoggedIn><br /><br />
    </article>
  )
}


async function DelayedAction() {
  await delay(2000)
  console.log("Delayed?")
  return <div>Test</div>
}

async function delay(msecs: number) {
  return new Promise((resolve) => setTimeout(resolve, msecs))
}