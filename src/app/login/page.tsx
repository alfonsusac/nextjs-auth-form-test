import { Input } from "@/component/input"
import { login } from "@/api/auth/actions"
import { cookies } from "next/headers"
import { loginForm } from "../forms"



export default function LoginPage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const prevUsr = cookies().get("username-autofill")?.value
  return (
    <>
      <h2>Login</h2>
      <form action={ login }>
        { searchParams.error && <div className="callout-error">{ searchParams.error }</div> }
        <Input { ...loginForm.fields.usr.attributes } label={ loginForm.fields.usr.label } defaultValue={ loginForm.defaultValues.usr.get() } />
        <Input { ...loginForm.fields.pwd.attributes } label={ loginForm.fields.pwd.label } />
        <button type="submit">Login</button>
        <a href="/register" className="button">Register</a>
      </form>
    </>
  )
}
