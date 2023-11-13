import { Input } from "@/component/input"
import { Error, redirect, returnErrorMessage, returnSuccessMessage, returnUnknownError } from "@/lib/error"
import { register, sendEmailVerification } from "@/api/authentication"
import { createForm } from "@/lib/validations/formData"

export const registerForm = createForm({
  'eml': {
    label: "Email",
    required: "Email is required",
    email: "Email has to be in email format",
    persistValue: {}
  },
  'usr': {
    label: "Username",
    required: "Username is required!",
    text: "Username has to be a text!",
    persistValue: {}
  },
  'pwd': {
    label: "Password",
    required: "Password is required!",
    password: "Password has to be a text!",
  },
})

export default function RegisterPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <>
      <h2>Sign Up</h2>
      <form>
        { searchParams.error && <div data-callout-error>{ searchParams.error }</div> }
        { searchParams.error && <div data-callout-success>{ searchParams.success }</div> }
        <Input { ...registerForm.fields.eml.attributes } label={ registerForm.fields.eml.label } defaultValue={ registerForm.defaultValues.eml.get() } />
        <Input { ...registerForm.fields.usr.attributes } label={ registerForm.fields.usr.label } defaultValue={ registerForm.defaultValues.usr.get() } />
        <Input { ...registerForm.fields.pwd.attributes } label={ registerForm.fields.pwd.label } />
        <br />
        <button
          type="submit"
          formAction={
            async (formData) => {
              "use server"
              const input = registerForm.validate(formData)
              if (!input.ok) returnErrorMessage("Invalid input")

              const res = await register(input.usr, input.eml, input.pwd)
              switch (res) {
                case "Email is already taken":
                  returnErrorMessage("Email is already taken")
                case "Username is already taken":
                  returnErrorMessage("Username is already taken")
                case "Unknown Server Error":
                  returnUnknownError()
              }

              await sendEmailVerification(input.usr, input.eml)

              redirect("/", "Account registered. Please check email to verify your email")
            }
          }
        >Register</button>
        <a href="/login" className="button">login</a>
      </form >
    </>
  )
}
