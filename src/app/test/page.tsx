import { headers } from "next/headers"

export default function Page() {
  const header = headers()
  return (
    <>
      <pre>
        { JSON.stringify(header, null, 1) }
      </pre>
      <form>
        <button formAction={ async () => {
          "use server"
          const header = headers()
          console.log(JSON.stringify(header, null, 1))
        } }>
          Test
        </button>
      </form>
    </>
  )
}