import { Input } from "@/component/input"
import { Navigation } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"
import { SearchParamStateCallout } from "@/component/searchParams"
import { Authentication } from "@/api/authentication"

const form = createForm({
  'email': {
    label: "Email",
    required: "Email is required",
    email: "Email has to be in email format",
    persistValue: {}
  },
})


export default function PasswordlessLoginPage({ searchParams }: { searchParams: { [key: string]: string } }) {

  return (
    <>
      <h1>Passwordless Login</h1>
      <p>Enter your email to sign in or register account using a one-time magic link</p>
      <form>
        <SearchParamStateCallout searchParams={ searchParams } />
        <Input { ...form.fields.email.attributes } label={ form.fields.email.label } defaultValue={ form.defaultValues.email.get() } />
        <br />
        <button type="submit" formAction={
          async (formData) => {
            "use server"
            console.log("Submitted passwordless login page")
            try {
              const { email } = form.validate(formData)
              await Authentication.requestPasswordlessLogin({ email})
              Navigation.success('Verification Email Sent!\n Please check your email.')
            }
            catch (error) {
              Navigation.handleFormError(error)
            }
          }
        } >
          Send Magic Link
        </button>
      </form >
      <section className="opacity-40">or continue with</section>
      <a data-primary href="/login" className="w-full text-center">Login with Password</a>
    </>
  )
}
