import { Authentication } from "@/api/authentication"
import { LoginSession, Session } from "@/api/session"
import { Form } from "@/component/form"
import { Input } from "@/component/input"
import { AuthenticatorMFA } from "@/lib/2fa"
import { Navigation } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"

const form = createForm({
  'code': {
    label: "Code",
    required: "Code is required!",
    text: "Code has to be a text!",
  },
})

export default async function MFAVerificationViaApp({ searchParams }: any) {
  
  const session = await Session.get()
  if(session) Navigation.redirectTo('/')
  
  const loginsession = await LoginSession.get()
  if (!loginsession) Navigation.redirectTo('/login')

  return <>
    <h1>2FA</h1>
    <p>Please enter authentication code from your authenticator app</p>
    <Form sp={ searchParams }>
      <Input { ...form.fields.code.attributes } label={ form.fields.code.label } />
      <br />
      <button type="submit" formAction={ action }>
        Login
      </button>
    </Form>
  </>
}

async function action(formData: FormData) {
  "use server"
  try {
    const { code } = form.validate(formData)
    const session = await LoginSession.get()
    if (!session) Navigation.redirectTo('/login')

    await Authentication.loginWith2FA({
      username: session.username,
      otptoken: code
    })
  } catch (error) {
    Navigation.handleFormError(error)    
  }

}