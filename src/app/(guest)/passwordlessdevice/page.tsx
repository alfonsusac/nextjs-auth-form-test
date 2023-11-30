import { Navigation } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"
import { DeviceLoginForm } from "./client"
import { server } from '@passwordless-id/webauthn'
import { RegistrationEncoded } from "@passwordless-id/webauthn/dist/esm/types"
import { Request } from "@/lib/request"
import { User } from "@/model/user"
import { ClientError } from "@/lib/error/class"

const form = createForm({
  'username': {
    label: "Username",
    required: "Username is required!",
    text: "Username has to be a text!",
    persistValue: {}
  },
})

export default async function LoginViaDevice({ searchParams }: any) {

  return <>
    <h1>Login with Device</h1>
    <p>Using passwordless method that securely login this platform as a key</p>
    <DeviceLoginForm
      sp={ searchParams }
      nonce={ crypto.randomUUID() }
    />
    <section className="opacity-40">or continue with</section>
    <a data-primary href="/register" className="w-full text-center">Register with Password</a>
    <a data-primary href="/passwordless" className="w-full text-center mt-4">Login without Password (Magic Link)</a>
  </>
}