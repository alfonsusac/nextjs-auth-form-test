import { getCurrentUser, redirectToHomeIfNotAuthenticated } from "@/api/authentication"
import { registerPasswordless } from "@/api/passwordless"
import { Input } from "@/component/input"
import { handleActionError, redirect } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"

const passwordlessRegisterForm = createForm({
  'username': {
    label: "Username",
    required: "Username is required!",
    text: "Username has to be a text!",
    persistValue: {}
  },
})

export default async function PasswordlessRegisterPage({ searchParams }: { searchParams: { [key: string]: string } }) {

  const session = await getCurrentUser()
  if (!session) redirect('/', 'error=Not Authenticated. Please log in again.')
  if (session.username) redirect('/')

  return (
    <>
      <h2>Create Username</h2>
      <p>for email: { session.email }</p>
      <form>
        <Input { ...passwordlessRegisterForm.fields.username.attributes } label={ passwordlessRegisterForm.fields.username.label } />
        <input value={ session.email } hidden name="email" />
        <br />
        <button type="submit" formAction={ async (formData) => {
          "use server"
          try {
            const { username } = passwordlessRegisterForm.validate(formData)
            const email = formData.get('email')
  
            const user = await getCurrentUser()
            if (!user) redirect('/')
  
            if (email !== user.email) redirect('/passwordless', 'error=Session expired. Please try again')
  
            await registerPasswordless(username, user.email)

            redirect('/')
          }
          catch (error) { handleActionError(error) }

        } }>Register</button>
      </form>
    </>
  )
}