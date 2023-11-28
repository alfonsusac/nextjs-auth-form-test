import { Form } from "@/component/form"
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

export default async function LoginViaDevice({ searchParams }: any) {
  
  return <>
    <h1>Login with Device</h1>
    <p>Using passwordless method that securely login this platform as a key</p>
    <Form sp={ searchParams }>
      <Input { ...form.fields.username.attributes } label={ form.fields.username.label } />
      <br />
      <button type="submit" formAction={ action }>Register</button>
    </Form>
    <section className="opacity-40">or continue with</section>
    <a data-primary href="/register" className="w-full text-center">Register with Password</a>
    <a data-primary href="/passwordless" className="w-full text-center mt-4">Login without Password (Magic Link)</a>
  </>
}

async function action(formData: FormData) {
  "use server"
  try {
    const { username } = form.validate(formData)


  } catch (error) {
    Navigation.handleFormError(error)
  }
}