import { AuthGuard, Authentication, getCurrentSession } from "@/api/authentication"
import { registerPasswordless } from "@/api/passwordless"
import { Input } from "@/component/input"
import { Navigation } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"

const form = createForm({
  'username': {
    label: "Username",
    required: "Username is required!",
    text: "Username has to be a text!",
    persistValue: {}
  },
})

export default async function PasswordlessRegisterPage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const session = await AuthGuard.usernamelessOnly()

  return (
    <>
      <h1>Create Username</h1>
      <p>for email: { session.email }</p>
      <form>
        <Input { ...form.fields.username.attributes } label={ form.fields.username.label } />
        <input value={ session.email } hidden name="email" readOnly />
        <br />
        <button type="submit" formAction={ action }>Register</button>
      </form>
    </>
  )
}

async function action(formData: FormData) {
  "use server"
  try {
    const user = await getCurrentSession()
    if (!user) Navigation.redirectTo('/')

    const { username } = form.validate(formData)
    const email = formData.get('email')

    if (email !== user.email)
      Navigation.redirectTo('/passwordless', 'error=Session expired. Please try again')

    await Authentication.registerViaPasswordless({ username, email: user.email })
    Navigation.redirectTo('/', 'success=Username is set!')
  }
  catch (error) {
    Navigation.handleFormError(error)
  }
}