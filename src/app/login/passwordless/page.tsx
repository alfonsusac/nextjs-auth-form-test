import { Input } from "@/component/input"
import { returnSuccessMessage, returnErrorMessage, returnUnknownError, redirect } from "@/lib/error"
import { authCookie, login } from "@/api/authentication"
import { createForm } from "@/lib/validations/formData"
import { resend } from "@/lib/email"



const passwordlessLoginForm = createForm({
  'eml': {
    label: "Email",
    required: "Email is required",
    email: "Email has to be in email format",
    persistValue: {}
  },
})

export default function PasswordlessLoginPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <>

      <h2>Login with Magic Link</h2>
      <form>
        { searchParams.error &&
          <div data-callout-error>{ searchParams.error }</div>
        }
        <Input { ...passwordlessLoginForm.fields.eml.attributes } label={ passwordlessLoginForm.fields.eml.label } defaultValue={ passwordlessLoginForm.defaultValues.eml.get() } />

        <br />

        <button type="submit" formAction={
          async (formData) => {
            "use server"

            const input = passwordlessLoginForm.validate(formData)
            if (!input.ok)
              returnErrorMessage("Invalid input")

            const res = await (async () => {
              
              await resend.emails.send


            })()

            // const res = await login(input.usr, input.pwd)
            // switch (res) {
            //   case "Unknown Server Error":
            //     returnUnknownError()
            //   case "User not found":
            //   case "Wrong password":
            //     returnErrorMessage("Invalid credentials")
            // }

            authCookie.set(res.jwt)
            redirect('/', 'success=Successfuly logged in')
          }
        } >
          Send Magic Link
        </button>
        
        <br />
        <br />

        <a href="/register" className="button">register</a>
        <a href="/forgot" className="button">forgot password</a>

        <br />
        <br />

        <a data-primary href="/login/passwordless">
          Login with Password
        </a>
      </form >
    </>
  )
}
