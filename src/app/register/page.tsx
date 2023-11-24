import { Input } from "@/component/input"
import { handleActionError, redirect } from "@/lib/error"
import { register } from "@/api/authentication"
import { createForm } from "@/lib/validations/formData"
import { sendEmailVerification } from "@/api/verification"
import { SearchParamStateCallout } from "@/component/searchParams"

const form = createForm({
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
        <Input { ...form.fields.eml.attributes } label={ form.fields.eml.label } defaultValue={ form.defaultValues.eml.get() } />
        <Input { ...form.fields.usr.attributes } label={ form.fields.usr.label } defaultValue={ form.defaultValues.usr.get() } />
        <Input { ...form.fields.pwd.attributes } label={ form.fields.pwd.label } />
        <br />
        <button
          type="submit"
          formAction={ async (formData) => {

            "use server"
            try {

              // Validate the input
              const { usr, eml, pwd } = form.validate(formData)

              // Creates new user row in the database.
              await register({ username: usr, email: eml, password: pwd })

              // Send email verification
              // await sendEmailVerification(usr, eml)
              redirect("/login", "success=Account registered. You can now log in.")
            }
            catch (error) { handleActionError(error) }

          } }
        > Register </button>
        <a href="/login" className="button">login</a>
      </form >
    </>
  )
}
