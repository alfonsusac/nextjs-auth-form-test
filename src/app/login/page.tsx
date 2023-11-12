import { Input } from "@/component/input"
import { returnSuccessMessage, returnErrorMessage, returnUnknownError, redirect } from "@/lib/action"
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
        
        <button type="submit" formAction={
          async (formData) => {
            "use server"

            const input = loginForm.validate(formData)
            if (!input.ok)
              returnErrorMessage("Invalid input")

            const res = await login(input.usr, input.pwd)
            switch (res) {
              case "Unknown Server Error":
                returnUnknownError()
              case "User not found":
              case "Wrong password":
                returnErrorMessage("Invalid credentials")
            }

            authCookie.set(res.jwt)
            redirect('/', 'success=Successfuly logged in')
          }
        } >
          Login
        </button>
        <a href="/register" className="button">register</a>
        <a href="/forgot" className="button">forgot password</a>

        <br />
        <br />
        <br />

        <button type="submit">
          Login without Password
        </button>
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
          returnErrorMessage("Invalid input")

        const res = await login(input.usr, input.pwd)
        switch (res) {
          case "Unknown Server Error":
            returnUnknownError()
          case "User not found":
          case "Wrong password":
            returnErrorMessage("Invalid credentials")
        }

        authCookie.set(res.jwt)
        redirect('/', 'success=Successfuly logged in')
      }
    } >
      Login
    </button>
  )
}
