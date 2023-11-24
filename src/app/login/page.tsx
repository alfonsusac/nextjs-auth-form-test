import { Input } from "@/component/input"
import { redirect, handleActionError } from "@/lib/error"
import { login } from "@/api/authentication"
import { createForm } from "@/lib/validations/formData"
import { Form } from "@/component/form"



const loginForm = createForm({
  'username': {
    label: "Username",
    required: "Username is required!",
    text: "Username has to be a text!",
    persistValue: {}
  },
  'password': {
    label: "Password",
    required: "Password is required!",
    password: "Password has to be a text!",
    min: 8,

  },
})

export default function LoginPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <section data-dialog>
      <h2>Login</h2>
      <Form sp={ searchParams }>
        <Input { ...loginForm.fields.username.attributes } label={ loginForm.fields.username.label } defaultValue={ loginForm.defaultValues.username.get() } />
        <Input { ...loginForm.fields.password.attributes } label={ loginForm.fields.password.label } />
        <br />
        <button type="submit" formAction={
          async (formData) => {

            "use server"
            try {
              const input = loginForm.validate(formData)
              await login(input)
              redirect('/', 'success=Successfuly logged in')
            }
            catch (error) { handleActionError(error) }

          }
        } >
          Login
        </button>
        <a href="/register">register</a>
        <a href="/forgotpassword">forgot password</a>
      </Form >
      <section className="opacity-40">or continue with</section>
      <a data-primary href="/passwordless" className="w-full text-center">Login without Password</a>
    </section>
  )
}
