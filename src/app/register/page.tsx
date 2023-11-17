import { Input } from "@/component/input"
import { handleActionError, redirect } from "@/lib/error"
import { register } from "@/api/authentication"
import { createForm } from "@/lib/validations/formData"
import { sendEmailVerification } from "@/api/verification"
import { SearchParamStateCallout } from "@/component/searchParams"

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

export default async function RegisterPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <>
      <h2>Sign Up</h2>
      <form>
        <SearchParamStateCallout searchParams={ searchParams } />
        <Input { ...registerForm.fields.eml.attributes } label={ registerForm.fields.eml.label } defaultValue={ registerForm.defaultValues.eml.get() } />
        <Input { ...registerForm.fields.usr.attributes } label={ registerForm.fields.usr.label } defaultValue={ registerForm.defaultValues.usr.get() } />
        <Input { ...registerForm.fields.pwd.attributes } label={ registerForm.fields.pwd.label } />
        <br />
        <button
          type="submit"
          formAction={ async (formData) => {

            "use server"
            try {

              // Validate the input
              const { usr, eml, pwd } = registerForm.validate(formData)

              // Creates new user row in the database.
              await register({ username: usr, email: eml, password: pwd })

              // Send email verification
              await sendEmailVerification(usr, eml)
              redirect("/", "success=Account registered. Please check email to verify your email")
            }
            catch (error) { handleActionError(error) }

          } }
        > Register </button>
        <a href="/login" className="button">login</a>
      </form >
    </>
  )
}
