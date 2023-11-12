import { Input } from "@/component/input"
import { registerForm } from "../forms"
import { cookies } from "next/headers"
import { Error, redirectSuccess, redirectWithError, redirectWithUnknownError } from "@/lib/action"
import { register, sendEmailVerification } from "@/api/authentication"

export default function RegisterPage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const prevUsr = cookies().get("username-autofill")?.value
  const prevEml = cookies().get("email-autofill")?.value
  return (
    <>
      <h2>Sign Up</h2>
      <form>
        { searchParams.error && <div className="callout-error">{ searchParams.error }</div> }
        <Input { ...registerForm.fields.eml.attributes } label={ registerForm.fields.eml.label } defaultValue={ prevEml } />
        <Input { ...registerForm.fields.usr.attributes } label={ registerForm.fields.usr.label } defaultValue={ prevUsr } />
        <Input { ...registerForm.fields.pwd.attributes } label={ registerForm.fields.pwd.label } />
        <br />
        <button
          type="submit"
          formAction={
            async (formData) => {
              "use server"
              const input = registerForm.validate(formData)
              if (!input.ok) Error.setSearchParam({ error: "Invalid input" })

              const res = await register(input.usr, input.eml, input.pwd)
              switch (res) {
                case "Email is already taken":
                  redirectWithError("Email is already taken")
                case "Username is already taken":
                  redirectWithError("Username is already taken")
                case "Unknown Server Error":
                  redirectWithUnknownError()
              }

              await sendEmailVerification(res.email)

              redirectSuccess("Account registered. Please check email to verify your email")
            }
          }
        >Register</button>
        <a href="/login" className="button">login</a>
      </form >
    </>
  )
}
