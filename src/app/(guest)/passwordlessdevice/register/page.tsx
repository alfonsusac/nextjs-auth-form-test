import { Authentication, getCurrentSession } from "@/api/authentication"
import { LoginWithDeviceWebAuthnSession, Session } from "@/api/session"
import { Form } from "@/component/form"
import { Input } from "@/component/input"
import { Navigation } from "@/lib/error"
import prisma from "@/lib/singleton"
import { createForm } from "@/lib/validations/formData"
import { PrismaUtil } from "@/model"
import { User } from "@/model/user"

const form = createForm({
  'email': {
    label: "Email",
    required: "Email is required!",
    email: "Email has to be in a valid format!",
  },
})

export default async function PasswordlessRegisterPage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const session = await LoginWithDeviceWebAuthnSession.get()
  if (!session) Navigation.redirectTo('/passwordlessdevice', 'error=Please try again')

  return <>
    <h1>Register</h1>
    <p>Please add email since you created new account using device authentication.</p>
    <p>for username: { session.username }</p>
    <Form sp={searchParams}>
      <Input { ...form.fields.email.attributes } label={ form.fields.email.label } />
      <input value={ session.username } hidden name="username" readOnly />
      <br />
      <button type="submit" formAction={ action }>Register</button>
    </Form>
  </>
}

async function action(formData: FormData) {
  "use server"
  try {
    const session = await LoginWithDeviceWebAuthnSession.get()
    if (!session) Navigation.redirectTo('/passwordlessdevice', 'error=Please try again')

    const { email } = form.validate(formData)
    const username = formData.get('username') as string

    if (username !== session.username)
      Navigation.redirectTo('/passwordless', 'error=Session expired. Please try again')

    try {
      await prisma.userDeviceAuth.create({
        data: {
          id: session.id,
          algorithm: session.algorithm,
          publicKey: session.publicKey,
          user: {
            create: {
              email,
              provider: 'webauthn',
              username: session.username,
            }
          }
        }
      })
    } catch (error) {
      PrismaUtil.throwIfConstraintError(error, "email", "Email")
      PrismaUtil.throwIfConstraintError(error, "username", "Username")
      throw error
    }

    await Session.create({
      email,
      username: session.username,
      verified: false
    })

    Navigation.redirectTo('/', 'success=Successfully Registered using Device Auth!')
  }
  catch (error) {
    Navigation.handleFormError(error)
  }
}