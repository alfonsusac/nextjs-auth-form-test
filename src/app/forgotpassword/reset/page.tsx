import { Verifications, resetPassword } from "@/api/authentication"
import { InvalidSearchParam } from "@/api/verification"
import { Input } from "@/component/input"
import { SearchParamStateCallout } from "@/component/searchParams"
import { handleActionError, redirect } from "@/lib/error"
import { JWTHandler } from "@/lib/jwt"
import { createForm } from "@/lib/validations/formData"

const form = createForm({
  'password': {
    label: 'New Password',
    required: "Please insert password",
    password: "Please insert valid password",
  },
  "hiddenToken": {
    label: "",
    required: ""
  }
})

const resetPasswordToken = new JWTHandler<{
  username: string
}>("1h")

export const dynamic = 'force-dynamic'
export default async function ResetPassword({ searchParams }: any) {

  try {
    const data = await Verifications.forgotPassword.verify(searchParams.purpose, searchParams.key)
    const token = await resetPasswordToken.encode({ username: data.username })

    return (
      <>
        <h2>Reset Password</h2>
        <form>
          <SearchParamStateCallout searchParams={ searchParams } />
          <input name="hiddenToken" value={ token } hidden readOnly/>
          <Input { ...form.fields.password.attributes } label={ form.fields.password.label } />
          <br />
          <button formAction={
            async (formData) => {
              "use server"
              try {
                const { password, hiddenToken } = form.validate(formData)
                const payload = await resetPasswordToken.decode(hiddenToken)
                await resetPassword({
                  username: payload.username,
                  newPassword: password
                })
                redirect('/', 'success=Password successfully resetted!')
              }
              catch (error: any) { handleActionError(error) }
            }
          }>
            Reset password
          </button>
        </form>
      </>
    )


  } catch (error) {
    if (error instanceof InvalidSearchParam) {
      redirect('/')
    }
    console.log("Error verifying incoming request")
    console.log(error)
    redirect('/forgotpassword', 'error=Verification Failed. Please try again')
  }

}

