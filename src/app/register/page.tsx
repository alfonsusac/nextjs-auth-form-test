import { register } from "@/api/auth/actions"
import { Input } from "@/component/input"
import { registerForm } from "../forms"
import { cookies } from "next/headers"

export default function RegisterPage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const prevUsr = cookies().get("username-autofill")?.value
  const prevEml = cookies().get("email-autofill")?.value
  return (
    <>
      <h2>Sign Up</h2>
      <form action={ register }>
        { searchParams.error && <div className="callout-error">{ searchParams.error }</div> }
        <Input { ...registerForm.fields.eml.attributes } label={ registerForm.fields.eml.label } defaultValue={ prevEml } />
        <Input { ...registerForm.fields.usr.attributes } label={ registerForm.fields.usr.label } defaultValue={ prevUsr } />
        <Input { ...registerForm.fields.pwd.attributes } label={ registerForm.fields.pwd.label } />
        <br />
        <button type="submit">Register</button>
        <a href="/login" className="button">login</a>
      </form>
    </>
  )
}
