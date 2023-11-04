import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import { Input } from "@/component/input"
import { ComponentProps } from "react"

const inputs = {
  usr: {
    attributes: {
      name: "usr",
      label: "Username",
      type: "text",
    },
    validation: [`string`, `required`]
  },
  pwd: {
    attributes: {
      name: "pwd",
      label: "Password",
      type: "password",
    },
    validation: [`string`, `required`]
  },
} satisfies { [key: string]: { attributes: ComponentProps<typeof Input>, validation: (`string` | `required` | ``)[] } }


export default function Home({ searchParams }: { searchParams: { [key: string]: string } }) {

  async function login(data: FormData) {
    "use server"
    const username = data.get("usr")
    const password = data.get("pwd")

    const header = headers()
    console.log(Object.fromEntries(header))

    // cookies().set('login-username', data.set('username'))
    // console.log(data)
    return redirect('?test=hello')
  }

  return (
    <main>
      <section>
        <h1>Login</h1>

        <form action={ login }>
          <Input { ...inputs.usr } />
          <Input { ...inputs.pwd } />
          <button type="submit">Login</button>
          <a href="/register" className="button">Register</a>
        </form>
      </section>
    </main>
  )
}
