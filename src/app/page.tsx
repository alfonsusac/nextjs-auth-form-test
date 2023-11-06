import { Input } from "@/component/input"
import { login } from "@/actions/authentication"
import { loginForm } from "./forms"
import { cookies } from "next/headers"



export default function HomePage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const prevUsr = cookies().get("username-autofill")?.value
  return (
    <main>
      <section>
        <h1>Login</h1>
        <form action={ login }>
          { searchParams.error && <div className="callout-error">Error: { searchParams.error }</div> }
          <Input { ...loginForm.fields.usr.attributes } label={ loginForm.fields.usr.label } defaultValue={prevUsr} />
          <Input { ...loginForm.fields.pwd.attributes } label={ loginForm.fields.pwd.label } />
          <button type="submit">Login</button>
          <a href="/register" className="button">Register</a>
        </form>
      </section>
    </main>
  )
}
