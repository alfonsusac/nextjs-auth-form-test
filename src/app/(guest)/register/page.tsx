import { Input } from "@/component/input"
import { createForm } from "@/lib/validations/formData"
import { sendEmailVerification } from "@/api/verification"
import { SearchParamStateCallout } from "@/component/searchParams"
import { Navigation } from "@/lib/error"
import { Authentication } from "@/api/authentication"
import { Form } from "@/component/form"

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
      <h1>Sign Up</h1>
      <p>Enter your email, username and password to register to the application</p>
      <Form sp={searchParams}>
        <Input { ...form.fields.eml.attributes } label={ form.fields.eml.label } defaultValue={ form.defaultValues.eml.get() } />
        <Input { ...form.fields.usr.attributes } label={ form.fields.usr.label } defaultValue={ form.defaultValues.usr.get() } />
        <Input { ...form.fields.pwd.attributes } label={ form.fields.pwd.label } />
        <br />
        <button
          type="submit"
          formAction={ async (formData) => {

            "use server"
            try {
              const { usr, eml, pwd } = form.validate(formData)
              await Authentication.register({ username: usr, email: eml, password: pwd })
              Navigation.redirectTo("/login", "success=Account registered. You can now log in.")
            }
            catch (error) {
              Navigation.handleFormError(error)
            }

          } }
        > Register </button>
        <a href="/login" className="button">login</a>
      </Form >
      <section className="opacity-40">or continue with</section>
      <a data-primary href="/passwordless" className="w-full text-center">Register without Password</a>
    </>
  )
}
