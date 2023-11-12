import { auth, authCookie, sendEmailVerification } from "@/api/authentication"
import { ShowWhenLoggedIn } from "@/component/authentication"
import { redirect } from "@/lib/action"
import { User } from "@/model/user"


export default async function HomePage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const { rawCookie, session, errorMsg } = await auth()

  return (
    <article>

      { searchParams.success &&
        <div data-callout-success>{ searchParams.success }</div>
      }

      <h2> Welcome! </h2>
      <span>
        { session?.username ? `Logged in as: ${session?.username}` : `Not Logged in` }
      </span>

      <br />


      <ShowWhenLoggedIn
        fallback={
          <form>
            <a href="/login" data-primary>Log in</a>
            <a href="/register" data-primary>Register</a>
          </form>
        }
      >
        <form>
          {
            !session?.verified &&
            <button type="submit" formAction={
              async () => {

                "use server"

                const { session } = await auth()
                if (!session) redirect('/', 'error=Not Authenticated. Please log in again.')

                const data = await sendEmailVerification(session.username, session.email)
                console.log(data)
                redirect('/', 'success=Successful! Your email is verified.')

              }
            }>
              Verify Email
            </button>
          }
          <button formAction={
            async () => {

              "use server"

              authCookie.delete()
              redirect('', `success=Successfully logged out`)

            }
          }>
            Log out
          </button>
          <button formAction={
            async () => {

              "use server"

              const { session } = await auth()
              if (!session) redirect('/', 'error=Not Authenticated. Please log in again.')

              await User.remove(session?.username, session?.email)
              authCookie.delete()
              redirect('/', `success=Successfully delete account`)

            }
          }>
            Delete Account
          </button>

        </form>
      </ShowWhenLoggedIn>

      <br />
      <br />

      <small>
        <header>
          Cookie payload: <br />
        </header>
        <p>
          { JSON.stringify(rawCookie ?? "", null, 1) }
        </p>

        <ShowWhenLoggedIn>
          <header>
            JSON payload: <br />
          </header>
          <pre>
            { JSON.stringify(session, null, 1) }
          </pre>

          <header>
            Error: <br />
          </header>
          <pre>
            { errorMsg }
          </pre>
        </ShowWhenLoggedIn>
      </small>
    </article>
  )
}


