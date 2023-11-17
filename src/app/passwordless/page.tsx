import { Input } from "@/component/input"
import { handleActionError, returnSuccessMessage } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"
import { passwordlessInitialize } from "@/api/passwordless"
import { SearchParamStateCallout } from "@/component/searchParams"

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
        <SearchParamStateCallout searchParams={ searchParams } />
        <Input { ...passwordlessLoginForm.fields.eml.attributes } label={ passwordlessLoginForm.fields.eml.label } defaultValue={ passwordlessLoginForm.defaultValues.eml.get() } />
        <br />
        <button type="submit" formAction={
          async (formData) => {
            "use server"
            console.log("Submitted passwordless login page")
            try {
              const { eml } = passwordlessLoginForm.validate(formData)
              await passwordlessInitialize(eml)
              returnSuccessMessage('Verification Email Sent!\n Please check your email.')
            }
            catch (error) { handleActionError(error) }
          }
        } >
          Send Magic Link
        </button>
        <br />
        <br />
        <br />
        <a data-primary href="/login">Login with Password</a>
      </form >
    </>
  )
}