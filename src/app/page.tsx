import { IfNotLoggedIn, IfLoggedIn } from "@/component/authentication"
import { Form } from "@/component/form"
import { SVGProps } from "react"


export default function HomePage({ searchParams }: { searchParams: { [key: string]: string } }) {

  return (
    <article>
      <Form searchParams={searchParams}>
        <IfNotLoggedIn>
          <h2> Welcome! </h2>
          <p>Authentication using Next.js App routing and server actions</p>

          <br />
          <br />
          <a href="/login" data-primary>Get Started</a>
          <a href="https://github.com/alfonsusac/nextjs-auth-form-test">
            <MdiGithub className="me-2 text-lg inline align-[-0.225em]"/>
            Github
          </a>
        </IfNotLoggedIn>
        <IfLoggedIn>
          <h2>To-do</h2>
          You are doing great! Keep it up!
        </IfLoggedIn>
      </Form>
      <br />
      <br />
    </article>
  )
}


async function DelayedAction() {
  await delay(2000)
  console.log("Delayed?")
  return <div>Test</div>
}

async function delay(msecs: number) {
  return new Promise((resolve) => setTimeout(resolve, msecs))
}


export function MdiGithub(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" { ...props }><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"></path></svg>
  )
}