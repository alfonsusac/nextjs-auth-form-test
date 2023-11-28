/* eslint-disable @next/next/no-img-element */
import { Authentication } from "@/api/authentication"
import { AccountManagement, LoggedInUser } from "@/api/account"
import { Form } from "@/component/form"
import { Input } from "@/component/input"
import { AuthenticatorMFA } from "@/lib/2fa"
import { Navigation } from "@/lib/error"
import { ClientError } from "@/lib/error/class"
import { createForm } from "@/lib/validations/formData"
import { authenticator } from 'otplib'
import qrcode from "qrcode"
import { headers } from "next/headers"
import { development } from "@/lib/env"

const form = createForm(
  {
    'code': {
      label: "2FA Code",
      required: "Please fill in the 2FA code!",
      text: "Must be a text!"
    },
    'secret': {
      label: "",
      required: "Must be included!",
      text: "Must be a text!"
    }
  }
)
export default async function Setup2FAPage({ searchParams }: any) {

  if (!await LoggedInUser.isVerified()) {
    Navigation.notVerified()
  }

  if (await AccountManagement.is2FAEnabled(await Authentication.requireSession())) {
    Navigation.redirectTo('/settings', 'error=2FA is already enabled!')
  }

  const session = await Authentication.requireSession()
  const secret = await AuthenticatorMFA.generate()
  const uri = authenticator.keyuri(session.username, "Alfon's Auth", secret)
  const image = await qrcode.toDataURL(uri, { color: { dark: '#fff', light: '#0000' } })

  if (development) {
    console.log("Token: " + authenticator.generate(secret))
  }

  return <>
    <h1>Set up 2FA</h1>
    <p>Scan the QR Code below and fill in the code via your Authentication App</p>
    <section>
      <img
        alt="QR Code"
        src={ image }
        className="aspect-square w-3/4 mx-auto "
      />
    </section>
    <Form sp={ searchParams }>
      <Input { ...form.fields.code.attributes } label={ form.fields.code.label } />
      <input hidden readOnly name="secret" value={ secret } />
      <br />
      <button type="submit" formAction={ action }>
        Enter
      </button>
    </Form>
  </>

}

async function action(formData: FormData) {
  "use server"
  try {
    const { code, secret } = form.validate(formData)

    if (!AuthenticatorMFA.check(code, secret)) {
      ClientError.invalidInput("Inputted code is invalid, please try again.")
    }

    const { username } = await Authentication.requireSession()
    AccountManagement.set2FA({ username, twofasecret: secret })
    Navigation.redirectTo('/settings', 'success=2FA via Application successfully set!')
  } catch (error) {
    Navigation.handleFormError(error)
  }
}