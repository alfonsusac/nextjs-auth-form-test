import { Input } from "@/component/input"
import { redirectSuccess, redirectWithError, redirectWithUnknownError } from "@/lib/action"
import { authCookie, login } from "@/api/authentication"
import { createForm } from "@/lib/validations/formData"



const loginForm = createForm({
  'usr': {
    label: "Username",
    required: "Username is required!",
    text: "Username has to be a text!",
    persistValue: {}
  },
  'pwd': {
    label: "Password",
    required: "Password is required!",
    password: "Password has to be a text!",
    min: 8,

  },
})

export default function LoginPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  return (
    <>
      
      <h2>Login</h2>
      <form>
        { searchParams.error &&
          <div data-callout-error>{ searchParams.error }</div>
        }
        <Input { ...loginForm.fields.usr.attributes } label={ loginForm.fields.usr.label } defaultValue={ loginForm.defaultValues.usr.get() } />
        <Input { ...loginForm.fields.pwd.attributes } label={ loginForm.fields.pwd.label } />
        <br />
        <LoginButton />
        <a href="/register" className="button">Register</a>
      </form >
    </>
  )
}


function LoginButton() {
  return (
    <button type="submit" formAction={
      async (formData) => {
        "use server"

        const input = loginForm.validate(formData)
        if (!input.ok)
          redirectWithError("Invalid input")

        const res = await login(input.usr, input.pwd)
        switch (res) {
          case "Unknown Server Error":
            redirectWithUnknownError()
          case "User not found":
          case "Wrong password":
            redirectWithError("Invalid credentials")
        }

        authCookie.set(res.jwt)
        redirectSuccess('Successfuly logged in')
      }
    } >
      Login
    </button>
  )
}
