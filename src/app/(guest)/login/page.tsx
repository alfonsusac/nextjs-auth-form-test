import { Input } from "@/component/input"
import { Navigation } from "@/lib/error"
import { createForm } from "@/lib/validations/formData"
import { Form } from "@/component/form"
import { Authentication } from "@/api/authentication"

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
  return <>
    <h2>Login</h2>
    <p>Enter your username and password to log in into the application</p>
    <Form sp={ searchParams }>
      <Input { ...loginForm.fields.username.attributes } label={ loginForm.fields.username.label } defaultValue={ loginForm.defaultValues.username.get() } />
      <Input { ...loginForm.fields.password.attributes } label={ loginForm.fields.password.label } />
      <br />
      <button
        type="submit"
        formAction={
          async (formData) => {
            "use server"
            try {
              await Authentication.login(loginForm.validate(formData))
              Navigation.redirectTo('/', 'success=Successfuly logged in')
            }
            catch (error) {
              Navigation.handleFormError(error)
            }
          }
        }
      >
        Login
      </button>
      <a href="/register">register</a>
      <a href="/forgotpassword">forgot password</a>
    </Form >
    <section className="opacity-40">or continue with</section>
    <a data-primary href="/passwordless" className="w-full text-center">Login without Password</a>
  </>
}
