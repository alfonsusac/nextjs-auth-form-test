import { authCookie, jwtsecret } from "@/api/auth/actions"
import * as jose from 'jose'


export default async function HomePage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const auth = authCookie.readOnly.get()
  let data
  let errorMsg
  if (auth) {
    try {
      data = await jose.jwtVerify(auth, jwtsecret, {
        issuer: "alfon-auth",
      })
    } catch (error) {
      errorMsg = JSON.stringify(error, null, 1)
    }
  }

  return (
    <article>
      <h2>
        Welcome!
      </h2>
      <span>{ data?.payload.sub ? `Logged in as: ${data?.payload.sub}` : `Not Logged in` }</span>

      <header>
        Cookie payload: <br />
      </header>
      <p>
        { JSON.stringify(auth, null, 1) }
      </p>
      <header>
        JSON payload: <br />
      </header>
      <pre>
        { JSON.stringify(data, null, 1) }
      </pre>
      <header>
        Error: <br />
      </header>
      <pre>
        { errorMsg }
      </pre>
    </article>
  )
}
