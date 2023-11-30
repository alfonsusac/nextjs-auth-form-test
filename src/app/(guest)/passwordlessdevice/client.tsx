"use client"

import { Form } from "@/component/form"
import { Input } from "@/component/input"
import { ClientError } from "@/lib/error/class"
import { useFormState } from "react-dom"
import { client } from "@passwordless-id/webauthn"
import { RegistrationEncoded } from "@passwordless-id/webauthn/dist/esm/types"
import { checkUsernameForDeviceAuthAction, getUserDeviceAuthIDAction, verifyAuthenticationAction, verifyRegistrationAction } from "./action"

export function DeviceLoginForm({ nonce, sp }: {
  nonce: string,
  sp: any
}) {

  const [message, formAction] = useFormState(action, null)

  return <Form sp={ {...message, ...sp} }>
    <Input required type="text" label="Username" name="username" />
    <input readOnly hidden value={ nonce } name="challenge" />
    <br />
    <button type="submit" formAction={ formAction }>Continue</button>
  </Form>

  async function action(prevState: any, formData: FormData) {
    try {
      const username = formData.get('username') as string
      const challenge = formData.get('challenge') as string

      // Check if user is registered
      const getuserdevicesres = await getUserDeviceAuthIDAction(username)
      if(getuserdevicesres.error) ClientError.invalidInput(getuserdevicesres.error)


      // Authenticate if user exists
      if (getuserdevicesres.ids && getuserdevicesres.ids.length > 0) {
        console.log("Authenticate")
        const authentication = await client.authenticate(getuserdevicesres.ids, challenge)
        console.log(authentication)

        const res = await verifyAuthenticationAction(authentication, challenge)
      }

      const getuserres = await checkUsernameForDeviceAuthAction(username)
      if (getuserres.error) ClientError.invalidInput(getuserres.error)

      // Register new account if user doesn't exist
      if (getuserres.nouser) {
        console.log("No user -> Register User")

        const registration = await client.register(username, challenge, {
          authenticatorType: "auto",
          userVerification: "required",
          timeout: 60000,
          attestation: false,
          userHandle: username,
          debug: false
        })
        console.log(registration)
        const res = await verifyRegistrationAction(registration, challenge)
        return res
      }




      ClientError.invalidInput("Test Error")
    } catch (error: any) {
      return { error: error.message ?? JSON.stringify(error) }
    }
  }
}

