import { sendForgotPasswordEmail } from "@/api/authentication"
import { Input } from "@/component/input"
import { SearchParamStateCallout } from "@/component/searchParams"
import { handleActionError, returnSuccessMessage } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"

const form = createForm(
  {
    'email': {
      label: "Email",
      required: "Email is required",
      email: "Email has to be in email format",
      persistValue: {}
    },
  }
)
export default function ForgotPassword({ searchParams }: any) {
  return (
    <>
      <h1>Forgot Password</h1>
      <form>
        <SearchParamStateCallout searchParams={ searchParams } />
        <Input { ...form.fields.email.attributes } label={ form.fields.email.label } defaultValue={ form.defaultValues.email.get() } />
        <br />
        <button type="submit" formAction={
          async (formData) => {
            "use server"
            try {
              const { email } = form.validate(formData)
              await sendForgotPasswordEmail({ email })
              returnSuccessMessage('An email is sent to reset your password!')
            }
            catch (error: any) { handleActionError(error) }
          }
        }>
          Verify
        </button>

      </form>
    </>
  )
}