import { auth, authCookie } from "@/api/authentication"
import { ShowWhenLoggedIn } from "@/component/authentication"
import { redirect } from "next/navigation"


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
          <>
            <a href="/login" data-primary>Log in</a>
            <a href="/register" data-primary>Register</a>
          </>
        }
      >
        <form>
          <button type="submit" formAction={
            async () => {
              "use server"
              authCookie.delete()
              redirect(`?success=Successfully logged out`)
            }
          }>
            Log out
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


